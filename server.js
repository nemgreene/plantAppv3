const express = require("express");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const path = require("path");
var cors = require("cors");
const UserModel = require("./model/model");
app.use(cors());

const dbRoute =
  "mongodb+srv://NemGreene:toor@cluster0-1a7yh.mongodb.net/test?retryWrites=true&w=majority";

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true });
//connected?
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
mongoose.Promise = global.Promise;

require("./auth/auth");

app.use(bodyParser.urlencoded({ extended: false }));

const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-routes");

//jtw auth middleware
async function authenitcate(req, res, next) {
  let authHeader = req.headers.cookie;
  if (authHeader === undefined) {
    authHeader = req.headers.authorization;
    if (authHeader === undefined) {
      console.log("cant find any headers");
      return res.json("403");
    }
  }
  //found auth header

  let accessToken = authHeader && authHeader.split(" ")[1];
  let refreshToken = authHeader && authHeader.split(" ")[2];
  if (refreshToken === null || accessToken === null) {
    return res.json("no access found");
  }

  refreshToken = refreshToken.slice(12, -2);
  accessToken = accessToken.slice(12, -2);

  jwt.verify(accessToken, "top_secret", (err, user) => {
    if (err) {
      console.log(err.name);
      if (err.name === "TokenExpiredError") {
        res.json("timeout error");
      }
    } else {
      console.log("accessToken confirmed");
      next();
    }
  });
}
//public routes
app.use("/", routes);
//protected routes
app.use("/user", authenitcate, secureRoute, async (req, res) => {
  console.log("using authenticated route");
});

//Handle errors
app.use(function (err, req, res, next) {
  console.log("arrived at catchallerror ");
  res.status(err.status || 500);
  res.json({ error: "catchall error" });
});

//Server static assets if in production

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server started on : ", PORT);
});
