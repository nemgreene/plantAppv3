import React from "react";
import { Link } from "react-router-dom";
//delete plant button
class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
    };
  }
  //public landing page

  render() {
    return (
      <div>
        Welcome to your plant watering app
        <br />
        Either
        <Link to="/login" className="nav-link">
          Login
        </Link>
        or
        <Link to="/Register" className="nav-link">
          Register
        </Link>
      </div>
    );
  }
}

export default WelcomePage;
