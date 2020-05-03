const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../model/model");
//flash = require("connect-flash");

//Create a passport middleware to handle user registration
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log(req.body);
      let password1 = req.body.password,
        password2 = req.body.password2;
      try {
        //passwords do not match
        if (password1 !== password2) {
          console.log("passwords do not match");
          return done(null, false, { message: "Passwords do not match" });
        }

        if (
          !req.body.name ||
          !req.body.email ||
          !req.body.password ||
          !req.body.password2
        ) {
          console.log("fill out al the fields");
          return done(null, false, { message: "Fill out all the fields" });
        }

        //Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password });
        //Send the user information to the next middleware
        return done(null, user);
      } catch (error) {
        console.log(
          "We regret to inform you that you have thrown a signup error"
        );
        console.log(error);
        done(error, { message: "Email already in use" });
      }
    }
  )
);

//Create a passport middleware to handle User login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log("start authorization for login");
        //Find the user associated with the email provided by the user
        const user = await UserModel.findOne({ email });
        console.log(user, "is user in database?");
        if (!user) {
          console.log("user not found in db");
          //If the user isn't found in the database, return a message
          return done(null, false, { message: "User not found" });
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        console.log("user cleared db check");
        const validate = await user.isValidPassword(password);
        console.log(validate, "is password valid?");
        if (!validate) {
          console.log("password invalid");
          return done(null, false, { message: "Wrong Password" });
        }
        console.log("passsword validation cleared");
        //Send the user information to the next middleware
        console.log("passing over, having been authenticated in auth");
        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        console.log("You have encountered a login error");
        return done(error);
      }
    }
  )
);

const JWTstrategy = require("passport-jwt").Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require("passport-jwt").ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(
  new JWTstrategy(
    {
      //secret we used to sign our JWT
      secretOrKey: "top_secret",
      //we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      console.log("landed at jwt auth center");
      try {
        //Pass the user details to the next middleware
        console.log("cleared auth center");
        return done(null, token.user);
      } catch (error) {
        console.log("looks like a jwt error fam");
        done("error");
      }
    }
  )
);
