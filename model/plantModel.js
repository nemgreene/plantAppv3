const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Plant = new Schema({
  plant_description: {
    type: String,
  },
  water_amount: {
    type: String,
  },
  plant_priority: {
    type: String,
  },
  plant_img: {
    type: String,
  },
  date_watered: {
    type: String,
  },
  water_frequency: {
    type: Number,
  },
  increment_frequency: {
    type: Number,
  },
});

module.exports = mongoose.model("Plant", Plant);
