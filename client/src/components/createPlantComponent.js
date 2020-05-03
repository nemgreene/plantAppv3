import React, { Component } from "react";
import NavBar from "./navBarComponent";
import axios from "axios";

// add plant form page

let baseUrl = process.env.baseURL || "http://localhost:4000";
//get date
var today = new Date(),
  dd = String(today.getDate()).padStart(2, "0"),
  mm = String(today.getMonth() + 1).padStart(2, "0"),
  yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;

export default class CreatePlant extends Component {
  constructor(props) {
    super(props);

    this.onChangePlantDescription = this.onChangePlantDescription.bind(this);
    this.onChangeWaterAmount = this.onChangeWaterAmount.bind(this);
    this.onChangePlantPriority = this.onChangePlantPriority.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeFrequency = this.onChangeFrequency.bind(this);
    this.onChangeTimes = this.onChangeTimes.bind(this);
    this.checkForbidden = this.checkForbidden.bind(this);

    this.state = {
      plant_description: "",
      water_amount: "",
      plant_priority: "",
      date_watered: "",
      water_day: "1",
      water_frequency: "",
      increment_frequency: "",
      //alert for forbidden characters
      flagged: false,
    };
  }

  //check inputs as from is being filled
  checkForbidden(string) {
    let forbidden = "!@#$%^&*()_+-={}[]|'<>?/;:".split("");
    if (forbidden.includes(string.slice(-1))) {
      this.message = "Forbidden character";
      return "invalid";
    } else {
      this.setState({ flagged: false });
      return "valid";
    }
  }

  componentDidMount() {
    this.setState({
      date_watered: today,
    });
  }
  onChangePlantDescription(e) {
    if (this.checkForbidden(e.target.value) === "invalid") {
      this.setState({ flagged: true });
    } else {
      this.setState({
        plant_description: e.target.value,
      });
    }
  }

  onChangeWaterAmount(e) {
    if (this.checkForbidden(e.target.value) === "invalid") {
      this.setState({ flagged: true });
    } else {
      this.setState({
        water_amount: e.target.value,
      });
    }
  }
  onChangeDate(e) {
    this.setState({
      date_watered: e.target.value,
    });
  }
  onChangeTimes(e) {
    console.log(this.state.water_day);
    this.setState({
      water_day: e.target.value,
    });
  }

  onChangeFrequency(e) {
    if (this.checkForbidden(e.target.value) === "invalid") {
      this.setState({ flagged: true });
    } else {
      this.setState({
        water_frequency: e.target.value,
      });
    }
  }
  onChangePlantPriority(e) {
    this.setState({
      plant_priority: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    //make sure all feilds are filled out
    let {
      plant_description,
      water_amount,
      plant_priority,
      date_watered,
      water_day,
      water_frequency,
    } = this.state;

    if (
      !plant_description ||
      !water_amount ||
      !date_watered ||
      !plant_priority ||
      !water_day ||
      !water_frequency
    ) {
      console.log("incomplete feilds");

      this.setState({ flagged: true });
      this.message = "Missing required fields";
      return;
      //all feilds are filled, proceed to send off request
    }

    let increment = this.state.water_day / parseInt(this.state.water_frequency);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", document.cookie);

    var urlencoded = new URLSearchParams();
    urlencoded.append("plant_description", this.state.plant_description);
    urlencoded.append("water_amount", this.state.water_amount);
    urlencoded.append("plant_priority", this.state.plant_priority);
    urlencoded.append("date_watered", this.state.date_watered);
    urlencoded.append("increment_frequency", increment);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`/user/plants/add`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (result === '"timeout error"') {
          console.log("403 returned, refreshing access token");
          //get new access token
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
            console.log("retry intial call");
            console.log(document.cookie);

            var myHeaders = new Headers();
            myHeaders.append(
              "Content-Type",
              "application/x-www-form-urlencoded"
            );
            //retry add erquest
            var urlencoded = new URLSearchParams();
            urlencoded.append(
              "plant_description",
              this.state.plant_description
            );
            urlencoded.append("water_amount", this.state.water_amount);
            urlencoded.append("plant_priority", this.state.plant_priority);
            urlencoded.append("date_watered", this.state.date_watered);
            urlencoded.append("increment_frequency", increment);

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: urlencoded,
              redirect: "follow",
            };

            fetch(`/user/plants/add`, requestOptions)
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.log("error", error));
          });
        }
      })
      .catch((error) => console.log("error", error));

    //reset form?
    //    this.setState({
    //      Plant_description: "",
    //      water_amount: "",
    //      Plant_priority: "",
    //      Plant_completed: "",
    //    });
  }

  render() {
    return (
      <div>
        {" "}
        <NavBar />
        <div style={{ marginTop: 20 }}>
          <h3>Add new plant</h3>
          <div>
            {this.state.flagged ? (
              <div className="alert alert-warning alert fade show" role="alert">
                <strong>Sorry!</strong> {this.message}
              </div>
            ) : (
              <div></div>
            )}
          </div>
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
              <button
                type="submit"
                value="Add Plant"
                className="btn btn-primary"
              >
                Add Plant
              </button>
              <a
                href="/dash"
                style={{ margin: 10 }}
                className="btn btn-outline-secondary"
              >
                Back to dash
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
