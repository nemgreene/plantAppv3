import React, { Component } from "react";
import axios from "axios";
import NavBar from "./navBarComponent";
//edit plant

export default class EditPlant extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.onChangePlantDescription = this.onChangePlantDescription.bind(this);
    this.onChangeWaterAmount = this.onChangeWaterAmount.bind(this);
    this.onChangePlantPriority = this.onChangePlantPriority.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeFrequency = this.onChangeFrequency.bind(this);
    this.onChangeTimes = this.onChangeTimes.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      _id: "",
      plant_description: "",
      water_amount: "",
      plant_priority: "",
      plant_completed: false,
      plant_img: "",
      date_watered: "",
      water_day: "",
      water_frequency: "",
      increment_frequency: "",
      loaded: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    let baseUrl = process.env.baseURL || "http://localhost:4000";

    axios
      .get(`/user/plant`, {
        headers: {
          Authorization: `null; ${document.cookie}`,
          id: this.props.match.params.id,
        },
      })
      .then((res) => {
        if (res.data === "timeout error") {
          console.log("403 returned, refreshing access token");
          //shoot off to get a new access token
          axios({
            method: "get",
            url: baseUrl + "/token",
            headers: {
              Authorization: document.cookie,
            },
          }).then((response) => {
            //reset document cookies
            document.cookie =
              "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            //set cookies from server response
            document.cookie = `accessToken= ${response.data.accessToken}"`;
            document.cookie = `refreshToken= ${response.data.refreshToken}`;
          });
          //retry our intial call with updated cookies in document
          axios
            .get(`${baseUrl}/user/plant`, {
              headers: {
                Authorization: `null; ${document.cookie}`,
                id: this.props.match.params.id,
              },
            })
            .then((res) => {
              this.setState({
                _id: res.data._id,
                plant_description: res.data.plant_description,
                water_amount: res.data.water_amount,
                plant_priority: res.data.plant_priority,
                plant_completed: res.data.plant_completed,
                date_watered: res.data.date_watered,
                increment_frequency: res.data.increment_frequency,
                water_frequency: 1,
              });
            });
          //handle successfull request
        } else {
          if (this._isMounted) {
            this.setState({
              _id: res.data._id,
              plant_description: res.data.plant_description,
              water_amount: res.data.water_amount,
              plant_priority: res.data.plant_priority,
              plant_completed: res.data.plant_completed,
              date_watered: res.data.date_watered,
              increment_frequency: res.data.increment_frequency,
              water_frequency: 1,
              loaded: true,
            });
          }
        }
      })
      .catch(function (err) {
        console.log("didmount error");
      });
  }

  //handle repetetive code?

  onChangePlantDescription(e) {
    this.setState({
      plant_description: e.target.value,
    });
  }

  onChangeWaterAmount(e) {
    console.log(e.target.value);
    this.setState({
      water_amount: e.target.value,
    });
  }
  onChangePlantPriority(e) {
    this.setState({
      plant_priority: e.target.value,
    });
  }
  onChangeDate(e) {
    this.setState({
      date_watered: e.target.value,
    });
  }
  onChangeTimes(e) {
    this.setState({
      water_day: e.target.value,
    });
  }

  onChangeFrequency(e) {
    this.setState({
      water_frequency: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    let increment = this.state.water_day / parseInt(this.state.water_frequency);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("plant_description", `${this.state.plant_description}`);
    urlencoded.append("water_amount", `${this.state.water_amount}`);
    urlencoded.append("plant_priority", ` ${this.state.plant_priority}`);
    urlencoded.append("date_watered", `${this.state.date_watered}`);
    urlencoded.append("increment_frequency", increment);
    urlencoded.append("id", `${this.state._id}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`/user/plants/update`, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));

    this.props.history.push("/dash");
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.state.loaded ? (
          <div style={{ marginTop: 20 }}>
            <h3>Edit {this.state.plant_description}</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.plant_description}
                  onChange={this.onChangePlantDescription}
                ></input>
              </div>
              <div className="form-group">
                <label>Water Amount</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.water_amount}
                  onChange={this.onChangeWaterAmount}
                ></input>
              </div>
              <div className="form-group">
                <label>Date Watered</label>
                <input
                  type="date"
                  className="form-control"
                  value={this.state.date_watered}
                  onChange={this.onChangeDate}
                ></input>
              </div>
              <div className="form-group">
                <label>Water how many times:</label>
                <select
                  type="select"
                  className="form-control"
                  value={this.state.water_day}
                  onChange={this.onChangeTimes}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className="form-group">
                <label>Per how many days:</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.water_frequency}
                  onChange={this.onChangeFrequency}
                ></input>
              </div>
              <label> Sunlight Needed</label>
              <div className="form-group">
                <div className="form-check form-check-inLine">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priorityOptions"
                    id="priorityLow"
                    value="Low"
                    checked={this.state.plant_priority === "Low"}
                    onChange={this.onChangePlantPriority}
                  ></input>
                  <label className="form-check-label">Low</label>
                </div>
                <div className="form-check form-check-inLine">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priorityOptions"
                    id="priorityMedium"
                    value="Medium"
                    checked={this.state.plant_priority === "Medium"}
                    onChange={this.onChangePlantPriority}
                  ></input>
                  <label className="form-check-label">Medium</label>
                </div>
                <div className="form-check form-check-inLine">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="priorityOptions"
                    id="priorityHigh"
                    value="High"
                    checked={this.state.plant_priority === "High"}
                    onChange={this.onChangePlantPriority}
                  ></input>
                  <label className="form-check-label">High</label>
                </div>
              </div>
              <div className="form-group">
                <input type="submit" value="Edit" className="btn btn-primary" />
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
