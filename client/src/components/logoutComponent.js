import React from "react";
import axios from "axios";

let baseUrl = process.env.baseURL || "http://localhost:4000";

class LogoutComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cookie: document.cookie,
    };
  }

  componentDidMount() {
    axios({
      method: "DELETE",
      url: `/token`,
      headers: {
        Authorization: `null; ${document.cookie}`,
      },
    })
      .then(() => {
        //reset document cookies
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      })
      .then(() => {
        this.props.history.push("/login");
      });
  }

  render() {
    return <div>Redirecting to login...</div>;
  }
}

export default LogoutComponent;
