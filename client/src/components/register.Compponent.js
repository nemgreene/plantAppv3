import React from "react";
//register
class RegisterComponent extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePassword2 = this.onChangePassword2.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      failure: false,
    };
  }

  onChangeName(e) {
    this.setState({ name: e.target.value });
  }
  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  onChangePassword2(e) {
    this.setState({ password2: e.target.value });
  }
  onSubmit() {
    let { name, email, password, password2 } = this.state;
    if ((!name, !email, !password, !password2 || password !== password2)) {
      this.setState({ failure: true });
      return null;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("name", `${this.state.name}`);
    urlencoded.append("email", `${this.state.email}`);
    urlencoded.append("password", `${this.state.password}`);
    urlencoded.append("password2", `${this.state.password2}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`/register`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result.slice(2, 9) === "message") {
          console.log("success");
          this.props.history.push("login");
        } else {
          console.log("error");
          this.setState({ failure: true });
          //this.props.history.push("/login");
        }
      })
      .catch((error) => console.log("error", "error"));
  }
  render() {
    return (
      <div className="row mt-5">
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center mb-3">
              <i className="fas fa-user-plus"></i> Register
            </h1>
            <div>
              {" "}
              <label>
                {this.state.failure ? (
                  <div
                    className=" center-block text-center alert alert-warning alert-dismissible fade show"
                    role="alert"
                  >
                    <strong>Sorry! </strong>Could not validate information
                    submitted
                  </div>
                ) : null}
              </label>
            </div>
            <form action="/users/register" method="POST">
              <div className="form-group">
                <label value="name">Name</label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                />
              </div>
              <div className="form-group">
                <label value="email">Email</label>
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
                <label value="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Create Password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                />
              </div>
              <div className="form-group">
                <label value="password2">Confirm Password</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={this.state.password2}
                  onChange={this.onChangePassword2}
                />
              </div>
            </form>
            <button
              onClick={this.onSubmit}
              className="btn btn-primary btn-block"
            >
              Register
            </button>
            <p className="lead mt-4">
              Have An Account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterComponent;
