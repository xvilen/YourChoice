//LINK all the required stuff
var express = require("express");
const Usermodel = require("../Models/usersModel");
const Productmodel = require("../Models/ProductModel");
const Cartmodel = require("../Models/cartModel");
const totalPrice = require("../Functions/Totalprice").totalPrice;

var router = express.Router();

//TODO LANDING PAGE  wrap totalprice aggregation in a function to increase code readability and decreace complaxity

router.get("/", async function (req, res) {
  let user;
  let totalprice = [];
  let newProduct;
  let Men;
  let Women;
  let Accessories;
  let random;
  try {
    try {
      user = await Usermodel.findOne({ username: req.session.passport.user });
      totalprice = await totalPrice(user.cart);
    } catch (error) {}

    newProduct = await Productmodel.find().sort({ createdAt: -1 }).limit(5);
    Men = await Productmodel.find({
      category: {
        $in: "Men",
      },
    }).limit(3);
    Women = await Productmodel.find({
      category: {
        $in: "Women",
      },
    }).limit(3);
    Accessories = await Productmodel.find({
      category: {
        $in: "Accessories",
      },
    }).limit(3);
    random = await Productmodel.aggregate([{ $sample: { size: 5 } }]);

    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("index", {
      newProduct,
      Men,
      Women,
      Accessories,
      random,
      user,
      totalprice: totalprice[0],
    });
  } catch (error) {
    res.status(404);
  }
});
router.get("/blog", async function (req, res) {
  let user;
  let totalprice = [];
  let newProduct;
  let Men;
  let Women;
  let Accessories;
  let random;
  try {
    try {
      user = await Usermodel.findOne({ username: req.session.passport.user });
      totalprice = await totalPrice(user.cart);
    } catch (error) {}

    newProduct = await Productmodel.find().sort({ createdAt: -1 }).limit(5);
    Men = await Productmodel.find({
      category: {
        $in: "Men",
      },
    }).limit(3);
    Women = await Productmodel.find({
      category: {
        $in: "Women",
      },
    }).limit(3);
    Accessories = await Productmodel.find({
      category: {
        $in: "Accessories",
      },
    }).limit(3);
    random = await Productmodel.aggregate([{ $sample: { size: 5 } }]);

    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("Blog", {
      newProduct,
      Men,
      Women,
      Accessories,
      random,
      user,
      totalprice: totalprice[0],
    });
  } catch (error) {
    res.status(404);
  }
});
router.get("/contact", async function (req, res) {
  let user;
  let totalprice = [];
  let newProduct;
  let Men;
  let Women;
  let Accessories;
  let random;
  try {
    try {
      user = await Usermodel.findOne({ username: req.session.passport.user });
      totalprice = await totalPrice(user.cart);
    } catch (error) {}

    newProduct = await Productmodel.find().sort({ createdAt: -1 }).limit(5);
    Men = await Productmodel.find({
      category: {
        $in: "Men",
      },
    }).limit(3);
    Women = await Productmodel.find({
      category: {
        $in: "Women",
      },
    }).limit(3);
    Accessories = await Productmodel.find({
      category: {
        $in: "Accessories",
      },
    }).limit(3);
    random = await Productmodel.aggregate([{ $sample: { size: 5 } }]);

    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("contact", {
      newProduct,
      Men,
      Women,
      Accessories,
      random,
      user,
      totalprice: totalprice[0],
    });
  } catch (error) {
    res.status(404);
  }
});

// new product route
router.get("/newproduct", async function (req, res) {
  let newProduct;
  try {
    newProduct = await Productmodel.find().sort({ createdAt: 1 }).limit(5);
    res.json({ newProduct });
  } catch (error) {
    res.status(404);
  }
});

module.exports = router;
