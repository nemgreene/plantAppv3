import React, { Component } from "react";

//Water plant button
export default class WaterPlant extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      date_watered: "",
    };
  }

  onSubmit(e) {
    e.preventDefault();
    //parse date
    var today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      inc;
    //water is now handled by increment_freq(possible float)

    if (this.props.increment_frequency > 0.5) {
      inc = 2;
    } else {
      inc = 1;
    }
    //am i watering tomorrow, or in 2 days, based on increment
    dd = parseInt(dd) + inc;
    dd = dd < 10 ? "0" + dd : dd;
    today = yyyy + "-" + mm + "-" + dd;
    //beam me up

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", document.cookie);

    var urlencoded = new URLSearchParams();
    urlencoded.append("date_watered", today);
    urlencoded.append("id", this.props.id);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`/user/plants/water`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
  }

  render() {
    return (
      <div>
        <button
          className="btn btn-outline-primary"
          style={({ width: 100 }, { textAlign: "center" })}
          onClick={this.onSubmit}
        >
          Water
        </button>
      </div>
    );
  }
}
