import React from "react";
import { Link } from "react-router-dom";
import logo from "../head.gif";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <nav className=" navbar navbar-expand-md navbar-light bg-light">
          <div className="navbarBrand">
            <img src={logo} width="30" alt="logo"></img>
          </div>
          <div className="null">
            <ul className="navbar-nav mr-auto">
              <li className="navbarItem">
                <Link to="/dash" className="nav-link">
                  Plants Directory
                </Link>
              </li>
              <li className="navbarItem">
                <Link to="/create" className="nav-link">
                  Add Plant
                </Link>
              </li>
              <li className="navbarItem">
                <Link to="/logout" className="nav-link">
                  Logout
                </Link>
              </li>
              <li className="navbarItem"></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavBar;
