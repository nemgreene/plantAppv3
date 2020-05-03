import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PlantsList from "./plantListComponent";
import EditPlant from "./editPlantComponent";
import CreatePlant from "./createPlantComponent";
import DeletePlant from "./deletePlantComponent";

import LoginComponent from "./loginComponent";
import RegisterComponent from "./register.Compponent";
import LogoutComponent from "./logoutComponent";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      document.cookie !== "null" ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);
class DashboardComponent extends React.Component {
  render() {
    return (
      <Router>
        <PrivateRoute path="/dash" exact component={PlantsList} />
        <PrivateRoute path="/create" component={CreatePlant} />
        <PrivateRoute path="/logout" component={LogoutComponent} />
        <PrivateRoute path="/edit/:id" component={EditPlant} />
        <PrivateRoute path="/delete/:id" component={DeletePlant} />

        <Route path="/login" component={LoginComponent} />
        <Route path="/register" component={RegisterComponent} />
      </Router>
    );
  }
}

export default DashboardComponent;

//Stretch Goals:

//asssignment:
//login/user specific db
//version control github
//deploy

//for my sanity:
//plant IMG
//Verify unique name in db, implement dup name strat (xA/x.a?)
//make not ugly(?)
//refact freq_inc logic(water)
//feild filled verif
//water all
