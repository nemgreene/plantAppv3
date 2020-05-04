import React from "react";
import { Link } from "react-router-dom";
import DeletePlantComponent from "./deletePlantComponent";
import WaterComponent from "./waterComponent.js";

const Plant = (props) => (
  <tr>
    <td className="plantsLi">{props.plant.plant_description}</td>
    <td className="plantsLi">{props.plant.date_watered}</td>
    <td className="plantsLi">{props.plant.plant_priority}</td>
    <td>
      <Link
        style={{ width: 71 }}
        className="btn btn-outline-dark"
        to={"/edit/" + props.plant._id}
      >
        Edit
      </Link>
      <DeletePlantComponent id={props.plant._id} />
    </td>
  </tr>
);

const Plants = (props) => (
  <tr>
    <td>{props.plant.plant_description} </td>
    <td> {props.message}</td>
    <td> {props.plant.water_amount} </td>
    <td>
      <WaterComponent
        id={props.plant._id}
        increment_frequency={props.plant.increment_frequency}
        plant={props.plant}
      />
    </td>
  </tr>
);

export { Plant, Plants };
