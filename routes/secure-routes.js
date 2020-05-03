const express = require("express");

const router = express.Router();
let Plant = require("../model/plantModel");

//verified user can get plants from db
router.get("/plants", function (req, res) {
  Plant.find(function (err, plants) {
    if (err) {
      console.log("could not get any plants");
    } else {
      res.json(plants);
    }
  });
});

//get plant by id
router.get("/plant", function (req, res) {
  Plant.findById(req.headers.id, function (err, plant) {
    if (err) {
      console.log(err);
    } else {
      res.json(plant);
    }
  });
});

//add new plant
router.post("/plants/add", function (req, res) {
  let plant = new Plant(req.body);
  plant
    .save()
    .then((plant) => {
      res.status(200).json({ plant: "plant added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new plant failed");
    });
});

//delete plant
router.delete("/plants/delete", (req, res) => {
  const { id } = req.body;
  Plant.findByIdAndDelete(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

//water plant
router.post("/plants/water", function (req, res) {
  Plant.findByIdAndUpdate(
    { _id: req.body.id },
    { date_watered: req.body.date_watered },
    function (err, plant) {
      if (err) console.log(err);
    }
  );
});

//edit plant
router.post("/plants/update", function (req, res) {
  Plant.findById(req.body.id, function (err, plant) {
    if (!plant) res.status(404).send("data not found");
    else
      (plant.plant_description = req.body.plant_description),
        (plant.water_amount = req.body.water_amount),
        (plant.plant_priority = req.body.plant_priority),
        (plant.plant_completed = req.body.plant_completed),
        (plant.plant_img = req.body.plant_img),
        (plant.date_watered = req.body.date_watered),
        (plant.water_day = req.body.water_day),
        (plant.water_frequency = req.body.water_frequency),
        (plant.increment_frequency = req.body.increment_frequency),
        plant
          .save()
          .then((plant) => {
            res.json("plant updated");
          })
          .catch((err) => {
            res.status(400).send("Update not possible");
          });
  });
});

module.exports = router;
