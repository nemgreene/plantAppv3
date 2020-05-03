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
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        //time to get some AccessTokens set up
        let accessToken = jwt.sign({ user }, "top_secret", {
          expiresIn: "1m",
        });
        // time to get some RefreshTokens set up
        const refreshToken = jwt.sign({ user: body }, "refresh_secret");
        //pass them to db
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
    }
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

//delete refresh token on logout
router.delete("/token", function (req, res) {
  if (req.headers.authorization === null) {
    res.json("trying to log out now");
  } else {
    let refreshToken = req.headers.authorization.split(" ")[2];
    refreshToken = refreshToken.slice(13);
    Token.findOneAndDelete({ refreshToken: refreshToken }, (err, token) => {
      if (!token) console.log("No Token in db");
      else console.log("found one", token);
    });
  }
  res.json("logout successful");
});

//get plants in db

module.exports = router;
