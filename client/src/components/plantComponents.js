import React from "react";
import DeletePlantComponent from "./deletePlantComponent";
import WaterComponent from "./waterComponent.js";
//individual table objects rendered
const Plant = (props) => (
  //obj rendered in plant log
  <tr>
    <td className="plantsLi">{props.plant.plant_description}</td>
    <td className="plantsLi">{props.plant.date_watered}</td>
    <td className="plantsLi">{props.plant.plant_priority}</td>
    <td>
      <a href="/edit/" style={{ width: 71 }} className="btn btn-outline-dark">
        Edit
      </a>
      <DeletePlantComponent id={props.plant._id} />
    </td>
  </tr>
);

const Plants = (props) => (
  //obj rendered in water callendar
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
