import React from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginComponent from "./components/loginComponent";
import RegisterComponent from "./components/register.Compponent";
import LandingPage from "./components/landingPageComponent";

import PlantsList from "./components/plantListComponent";
import EditPlant from "./components/editPlantComponent";
import CreatePlant from "./components/createPlantComponent";
import DeletePlant from "./components/deletePlantComponent";
import LogoutComponent from "./components/logoutComponent";

import HeadComponent from "./components/head/Head";

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

class App extends React.Component {
  render() {
    return (
      <Router>
        <PrivateRoute path="/dash" exact component={PlantsList} />
        <PrivateRoute path="/create" component={CreatePlant} />
        <PrivateRoute path="/logout" component={LogoutComponent} />
        <PrivateRoute path="/edit/:id" component={EditPlant} />
        <PrivateRoute path="/delete/:id" component={DeletePlant} />

        <PrivateRoute path="/" exact component={LandingPage} />
        <Route path="/login" component={LoginComponent} />
        <Route path="/register" component={RegisterComponent} />
      </Router>
    );
  }
}

export default App;

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
