var express = require("express");
const Productmodel = require("../Models/ProductModel");
const Usermodel = require("../Models/usersModel");
const totalPrice = require("../Functions/Totalprice").totalPrice;
const Cartmodel = require("../Models/cartModel");
const isLoggedIn = require("../Functions/IsLoggedIn").isLoggedIn;
const { json } = require("express");
var router = express.Router();

router.get("/addcart", isLoggedIn, async (req, res) => {
  try {
    const User = await Usermodel.findOne({
      username: req.session.passport.user,
    });
    const cartproduct = await Cartmodel.create({
      ...req.query,
      userId: User._id,
    });

    User.cart.unshift(cartproduct._id);
    await User.save();
    res.redirect(req.headers.referer);
  } catch (error) {
    res.send(error);
  }
});

router.get("/usercart", isLoggedIn, async (req, res) => {
  try {
    let totalprice = [];
    let user;
    user = await Usermodel.findOne({
      username: req.session.passport.user,
    });
    totalprice = await totalPrice(user.cart);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    user = await user.populate("cart");
    res.render("checkout", {
      user,
      totalprice: totalprice[0],
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// TODO while when product quantity is 1 when we splice it from user cart we need to remove from cart collection also
router.get("/quantity", async (req, res) => {
  try {
    let totalprice = [];
    let cart;
    cart = await Cartmodel.findOne({ _id: req.query.id });
    let user = await Usermodel.findOne({ username: req.session.passport.user });
    if (req.query.val === "inc") {
      cart.ProductQuantity += 1;
    } else if (req.query.val === "dec") {
      if (cart.ProductQuantity === 1) {
        cart.ProductQuantity -= 1;
        user.cart.splice(user.cart.indexOf(cart._id), 1);
      } else {
        cart.ProductQuantity -= 1;
      }
    }
    await cart.save();
    await user.save();

    totalprice = await totalPrice(user.cart);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.status(200).json({ quantities: cart, totalprice: totalprice[0] });
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
