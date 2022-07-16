const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const usersModel = require("../Models/usersModel");
require("../Strategies/PassportConfig");
var router = express.Router();

//  Login page.
router.get("/Login", function (req, res, next) {
  if (req.user) {
    res.redirect(req.headers.referer);
  }
  res.render("Login");
});
// Post Signup
router.post(
  "/signup",
  async (req, res, next) => {
    let user = await usersModel.findOne({ username: req.body.username });
    if (user) {
      if (user.password) {
        res.redirect(req.headers.referer);
      } else {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        user.password = hash;
        user.number = req.body.number;
        await user.save();
      }
    } else {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      user = await usersModel.create({
        name: req.body.name,
        username: req.body.username,
        number: req.body.number,
        password: hash,
      });
    }
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/Login",
  })
);

//post Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/Login",
  })
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// get Logout

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect(req.headers.referer);
});
module.exports = router;
