import React, { Component } from "react";

export default class WaterPlant extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      flagged: false,
      cookie: document.cookie,
    };
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  onSubmit() {
    //let hashedPassword = bcrypt.hash(this.state.password, 10)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", this.state.email);
    urlencoded.append("password", this.state.password);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`/login`, requestOptions)
      .then(async (response) => await response.text())
      .then(async (result) => {
        if (result.slice(2, 7) === "error") {
          this.setState({ flagged: true });
          return;
        } else {
          let accessToken = await result.slice(
            16,
            result.indexOf("refreshToken") - 2
          );
          let refreshToken = await result.slice(
            result.indexOf("refreshToken") + 15,
            -2
          );

          /*             console.log(accessToken);
           */ document.cookie = `accessToken = ${accessToken}`;
          /*             console.log(document.cookie); */
          document.cookie = `refreshToken = ${refreshToken}`;

          this.props.history.push("/dash");
        }
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <div className="row mt-5">
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center mb-3">
              {/*               <div>{this.state.cookie}</div> */}
              <i className="fas fa-sign-in-alt"></i> Login
            </h1>
            <div>
              {this.state.flagged ? (
                <div
                  className="alert alert-warning alert fade show"
                  role="alert"
                >
                  <strong>Sorry!</strong> Please try again
                </div>
              ) : null}
            </div>
            <form>
              <div className="form-group">
                <label className="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                />
              </div>
              <div className="form-group">
                <label className="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                />
              </div>
            </form>
            <button
              onClick={this.onSubmit}
              className="btn btn-primary btn-block"
            >
              Login
            </button>
            <br />
            <p className="lead mt-4">
              No Account? <a href="/register">Register</a>
              <br />
              Not Right? <a href="/">Home</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
