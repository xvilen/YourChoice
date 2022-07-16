const passport = require("passport");
const usersModel = require("../Models/usersModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { validate } = require("../Models/usersModel");

passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser(async (username, done) => {
  let user = await usersModel.findOne({ username });
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { sub, name, picture, email } = profile._json;

      let user = await usersModel.findOne({ GoogleId: sub });
      if (user) {
        done(null, user);
      } else {
        user = await usersModel.create({
          GoogleId: sub,
          username: email,
          name,
          img: picture,
        });
        done(null, user);
      }
    }
  )
);
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      let user = await usersModel.findOne({ username });
      if (!user) {
        return done(null, false);
      }
      try {
        const Validate = await bcrypt.compare(password, user.password);
        if (Validate) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(null, false);
      }
    }
  )
);
