const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let Token = require("../model/tokenModel");
let Plant = require("../model/plantModel");
const jwt_decode = require("jwt-decode");

const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post(
  "/register",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    console.log("info");
    console.log(res.message, "messsage");
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        console.log("passportAuth failed");
        const error = new Error("An Error occurred");
        console.log("return err to next ");
        return next(error);
      }
      console.log("no error from passport auth, onto the next");
      req.login(user, { session: false }, async (error) => {
        console.log(
          "startign next step?, passing user with hashed password, consider inserting cookie here"
        );
        if (error) return next(error);
        console.log("no error returned");
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        console.log("body = deconstructed body");
        //Sign the JWT token and populate the payload with the user email and id

        /*         const accessToken = jwt.sign({ user: body }, "top_secret"); */
        console.log("token signed, stored in token, see token below");
        let accessToken = jwt.sign({ user }, "top_secret", {
          expiresIn: "1m",
        });

        console.log("time to get some RefreshTokens set up");
        const refreshToken = jwt.sign({ user: body }, "refresh_secret");

        let dbToken = new Token({
          refreshToken: refreshToken,
          accessToken: accessToken,
        });

        dbToken
          .save()
          .then(console.log(accessToken))
          .catch((err) => {
            console.log("adding new token failed");
          });

        //Send back the token to the user
        console.log(accessToken);
        console.log("token tested, ready to be sent off in response");

        console.log("returning response");
        return res.json({ accessToken, refreshToken });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

//hit route to refresh access token
router.get("/token", function (req, res) {
  console.log("Lets get some new tokens fam");
  let accessToken = req.headers.authorization.split(" ")[1];
  let refreshToken = req.headers.authorization.split(" ")[2];
  //slicing and dicing req cookie
  accessToken = accessToken.slice(12, -2);
  refreshToken = refreshToken.slice(13);

  //is there a refreshtoken? sure hope so
  if (refreshToken === null) return res.json("No refresh Token");
  //lets find out if refresh token is in db
  let search = Token.findOne({ refreshToken: refreshToken }, (err, token) => {
    if (!token) return res.json("No Token in db");
  });
  //if it is, lets see if refresh token is valid
  jwt.verify(refreshToken, "refresh_secret", (err, user) => {
    if (err) {
      throw err;
      return res.json("refreshToken not valid");
    }
    console.log("jwt confirmed");
    //if we've come this far, we can know that the refresh token is valid
    //on to the next
    //create update access token(out of decoded refresh token)
    let data = jwt_decode(refreshToken, "refresh_secret");
    let updatedAccessToken = jwt.sign({ data }, "top_secret", {
      expiresIn: "1m",
    });

    accessToken = updatedAccessToken;

    res.json({ accessToken, refreshToken });

    console.log("All done herer scotty, beam me back up");
  });
});

/* router.patch("/plants/update", (req, res) => {
  console.log(req.params);
}); */

router.delete("/token", function (req, res) {
  console.log("Lets delete some refreshtokens fam");
  if (req.headers.authorization === null) {
    console.log("cant find any headers");
    res.json("trying to log out now");
  } else {
    console.log("found the headers");
    let refreshToken = req.headers.authorization.split(" ")[2];
    console.log(refreshToken);
    refreshToken = refreshToken.slice(13);
    Token.findOneAndDelete({ refreshToken: refreshToken }, (err, token) => {
      if (!token) console.log("No Token in db");
      else console.log("found one", token);
    });
  }
  res.json("logout successful");
});

router.get("/plants", function (req, res) {
  console.log("routing to unsecure plants route");
  Plant.find(function (err, plants) {
    if (err) {
      console.log("Hello");
    } else {
      console.log("found any plants?");
      return res.json(plants);
    }
  });
});

module.exports = router;
