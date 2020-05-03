import React, { Component } from "react";
import axios from "axios";
import NavBar from "./navBarComponent";
import { Plant, Plants } from "./plantComponents";

let baseUrl = process.env.baseURL || "http://localhost:4000";

let empty = 0;

export default class PlantsList extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      plants: [],
      cookie: document.cookie,
      loaded: false,
    };
  }

  handleDelete() {
    console.log("delete");
  }

  componentDidMount() {
    this._isMounted = true;

    axios
      .get(`/user/plants `)
      .then((response) => {
        this.setState({ plants: response.data, loaded: true });
      })
      .catch(function (err) {
        console.log(err, "err");
      });
  }

  componentDidUpdate() {
    if (this._isMounted) {
      //get plants from database
      axios
        .get(`/user/plants `)
        .then((response) => {
          //if response is timeout error
          if (response.data === "timeout error") {
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
            this.setState({ plants: this.state.plants, loaded: true });
            //handle successfull request
          } else {
            if (typeof response.data === "object" && this._isMounted) {
              this.setState({ plants: response.data, loaded: true });
            }
          }
        })
        .catch(function (err) {});
    }
  }

  plantList() {
    if (typeof this.state.plants === "string") {
      console.log("dont map me");
    } else {
      return this.state.plants.map((currentPlant, i) => {
        return <Plant plant={currentPlant} key={i} />;
      });
    }
  }
  //Plants to be watered to be rendered
  plantCallendar() {
    if (typeof this.state.plants === "string") {
      return <div></div>;
    } else if (this._isMounted) {
      return this.state.plants.map((currentPlant, i) => {
        //handle month => date conversion
        let callendar = {
          "01": 31,
          "02": 28,
          "03": 31,
          "04": 30,
          "05": 31,
          "06": 30,
          "07": 31,
          "08": 31,
          "09": 30,
          "10": 31,
          "11": 30,
          "12": 31,
        };
        //get date
        let newDate = new Date(),
          date = newDate.getDate(),
          date_watered = currentPlant.date_watered.slice(-1),
          mm = String(newDate.getMonth() + 1).padStart(2, "0"),
          dd = String(newDate.getDate()).padStart(2, "0"),
          //month day conversion
          totalDays = callendar[mm],
          freq = currentPlant.increment_frequency;
        //allows to set to future for counting
        //if (date_watered > dd) return null;
        //water every day?
        if (parseInt(date_watered) > parseInt(dd)) return null;
        if (freq === 0) {
          empty = 1;
          return <Plants plant={currentPlant} key={i} message={"Every Day"} />;
          //watering 2 of 3 times per day?
        }
        //reset around end/start of month
        if (date_watered >= totalDays - freq) {
          date_watered = date_watered - totalDays;
        }
        if (
          //every 2/3 day water cycle...water today or tomorrow
          freq % 1 !== 0 &&
          (parseInt(date_watered) + Math.floor(freq) === date ||
            parseInt(date_watered) + Math.ceil(freq) === date)
        ) {
          empty = empty;
          return (
            <Plants
              plant={currentPlant}
              key={i}
              message={"Today || Tomorrow"}
            />
          );
        }

        //water today
        //console.log(date_watered, freq, date);
        if (parseInt(date_watered) + (freq - 1) <= date) {
          empty = 1;
          return <Plants plant={currentPlant} key={i} message={"Today"} />;
        } else {
          console.log(date_watered, freq, date);
          return null;
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.state.loaded ? (
          <div>
            <h3>Plant Log</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Water Date</th>
                  <th>Sunlight Requirements</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{this.plantList()}</tbody>
            </table>
          </div>
        ) : (
          <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <div>
          {this.state.loaded ? (
            <div>
              <h3>Water Today</h3>
              <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                  <tr>
                    <th>{empty === 0 ? "None" : "Name"}</th>
                    <th>{empty === 0 ? null : "Water"}</th>
                    <th>{empty === 0 ? null : "Water Amount"}</th>
                    <th>{empty === 0 ? null : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>{this.plantCallendar()}</tbody>
              </table>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}
