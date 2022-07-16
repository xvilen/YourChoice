var express = require("express");
const Productmodel = require("../Models/ProductModel");
const Usermodel = require("../Models/usersModel");
const Cartmodel = require("../Models/cartModel");
const usersModel = require("../Models/usersModel");
const isLoggedIn = require("../Functions/IsLoggedIn").isLoggedIn;
const isAdmin = require("../Functions/IsLoggedIn").isAdmin;
var router = express.Router();

router.get("/", isLoggedIn, async (req, res) => {
  let products = await Productmodel.find();
  res.render("Admin/AdminProduct", { products });
});
router.get("/AddProduct", isLoggedIn, async (req, res) => {
  res.render("Admin/AdminAddProduct");
});

module.exports = router;
