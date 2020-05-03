const express = require("express");

const router = express.Router();
let Plant = require("../model/plantModel");

//Let's say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get("/profile", (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query,
  });
});

router.get("/dash", (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query,
  });
});

router.get("/plants", function (req, res) {
  Plant.find(function (err, plants) {
    if (err) {
      console.log("could not get any plants");
    } else {
      res.json(plants);
    }
  });
});

router.get("/plant", function (req, res) {
  console.log("grabbng some plants");
  console.log(req.headers.id);
  Plant.findById(req.headers.id, function (err, plant) {
    if (err) {
      console.log("could not get any plant");
    } else {
      console.log(plant);
      res.json(plant);
    }
  });
});

router.post("/plants/add", function (req, res) {
  console.log("create new plant route");
  console.log(req.body);
  console.log("req.body");
  let plant = new Plant(req.body);
  plant
    .save()
    .then(console.log(plant))
    .then((plant) => {
      res.status(200).json({ plant: "plant added successfully" });
    })
    .catch((err) => {
      res.status(400).send("adding new plant failed");
    });
});

//delete
router.delete("/plants/delete", (req, res) => {
  const { id } = req.body;
  console.log(id);
  Plant.findByIdAndDelete(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

//water plant
router.post("/plants/water", function (req, res) {
  console.log("secure watering plants route");
  console.log(req.body);
  Plant.findByIdAndUpdate(
    { _id: req.body.id },
    { date_watered: req.body.date_watered },
    function (err, plant) {
      if (err) console.log("couldnt find plant");
      else console.log("watered");
    }
  );
});

//edit
router.post("/plants/update", function (req, res) {
  console.log("edited route");
  Plant.findById(req.body.id, function (err, plant) {
    console.log(JSON.stringify(req.body));
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
