// LINK all required stuff
var express = require("express");
const Productmodel = require("../Models/ProductModel");
const Ordermodel = require("../Models/Ordermodel");
const Usermodel = require("../Models/usersModel");
const Cartmodel = require("../Models/cartModel");
const usersModel = require("../Models/usersModel");
const totalPrice = require("../Functions/Totalprice").totalPrice;
const isLoggedIn = require("../Functions/IsLoggedIn").isLoggedIn;
var router = express.Router();
// Profile route
router.get("/profile", isLoggedIn, async (req, res) => {
  try {
    let user = await Usermodel.findOne({ username: req.session.passport.user });
    let totalprice = await totalPrice(user.cart);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("userprofile", { user, totalprice: totalprice[0] });
  } catch (error) {
    res.send("error");
  }
});
// update route
router.post("/update/address", async (req, res) => {
  try {
    const { address, city, country, pincode, addressType } = req.body;
    let obj = { address, city, country, pincode, addressType };
    user = await Usermodel.findOneAndUpdate(
      {
        username: req.session.passport.user,
      },
      { $set: { address: obj } },
      { new: true }
    );
    res.redirect(req.headers.referer);
  } catch (error) {
    res.send(error);
  }
});
router.post("/update", async (req, res) => {
  try {
    user = await Usermodel.findOneAndUpdate(
      {
        username: req.session.passport.user,
      },
      { $set: req.body },
      { new: true }
    );
    res.redirect(req.headers.referer);
  } catch (error) {
    res.send(error);
  }
});
router.get("/favorite", isLoggedIn, async (req, res) => {
  try {
    let user;
    user = await usersModel
      .findOne({ username: req.session.passport.user })
      .populate("wishlist");
    let totalprice = await totalPrice(user.cart);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("favorite", { user, totalprice: totalprice[0] });
  } catch (error) {
    res.send(error);
  }
});
router.get("/like/:id", isLoggedIn, async (req, res) => {
  try {
    let user;
    user = await Usermodel.findOne({ username: req.session.passport.user });
    user.wishlist.push(req.params.id);
    await user.save();
    res.redirect(req.headers.referer);
  } catch (error) {
    res.status(404).send(error);
  }
});
router.get("/unlike/:id", isLoggedIn, async (req, res) => {
  try {
    let user;
    user = await Usermodel.findOne({ username: req.session.passport.user });
    user.wishlist.splice(user.wishlist.indexOf(req.params.id), 1);
    await user.save();
    res.redirect(req.headers.referer);
  } catch (error) {
    res.status(404).send(error);
  }
});
router.get("/cart", (req, res) => {
  res.redirect("http://localhost:3000/cart/usercart");
});
router.get("/order", isLoggedIn, async (req, res) => {
  try {
    let user;
    user = await usersModel
      .findOne({ username: req.session.passport.user })
      .populate("orders");
    let totalprice = await totalPrice(user.cart);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("order", { user, totalprice: totalprice[0] });
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});

router.get("/order/:id", isLoggedIn, async (req, res) => {
  try {
    let user;
    user = await usersModel.findOne({ username: req.session.passport.user });
    let order = await Ordermodel.findOne({ _id: req.params.id });
    let totalprice = await totalPrice(user.cart);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    console.log(order);
    res.render("SingleOrder", { user, order, totalprice: totalprice[0] });
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});
module.exports = router;
