// LINK required stuff
var express = require("express");
const Productmodel = require("../Models/ProductModel");
const Cartmodel = require("../Models/cartModel");
const Usermodel = require("../Models/usersModel");
const multer = require("multer");
var router = express.Router();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
var path = require("path");
const webp = require("webp-converter");
const totalPrice = require("../Functions/Totalprice").totalPrice;

// MULTER SETUP
const FileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const unique =
      Date.now() +
      "yourchoice" +
      Math.floor(Math.random() * 10000000000000000) +
      `${file.originalname}`;
    cb(null, unique);
  },
});
const Upload = multer({ storage: FileStorage });
// PRODUCT PAGE
router.get("/", async (req, res) => {
  let user;
  let totalprice = [];
  let products;

  try {
    try {
      user = await Usermodel.findOne({ username: req.session.passport.user });
      totalprice = await totalPrice(user.cart);
    } catch (error) {}
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    if (req.query.category) {
      products = await Productmodel.find({
        category: {
          $in: [req.query.category],
        },
      });
    } else {
      products = await Productmodel.find();
    }
    res.render("products", { products, user, totalprice: totalprice[0] });
  } catch (error) {
    res.status(404);
  }
});
// SORTING
router.get("/sort", async (req, res) => {
  let user;
  let totalprice = [];
  let products;

  try {
    try {
      user = await Usermodel.findOne({ username: req.session.passport.user });
      totalprice = await totalPrice(user.cart);
    } catch (error) {}
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    if (req.query.category) {
      products = await Productmodel.find({
        category: {
          $in: [req.query.category],
        },
      });
    } else {
      products = await Productmodel.find();
    }
    res.json({ products });
  } catch (error) {
    res.status(404);
  }
});

// SEARCH
router.get("/search", async (req, res) => {
  let query = RegExp(req.query.search, "i");
  let product = await Productmodel.find({
    $or: [
      { title: { $regex: query } },
      {
        category: {
          $in: [query],
        },
      },
      {
        color: {
          $in: [query],
        },
      },
    ],
  });
  res.json({ product });
});

// SINGLE PRODUCT
router.get("/singleproduct", async (req, res) => {
  let product;
  let relatedProduct;
  let user;
  let totalprice = [];
  try {
    product = await Productmodel.findOne({ _id: req.query.id });
    try {
      user = await Usermodel.findOne({ username: req.session.passport.user });
      totalprice = await totalPrice(user.cart);
    } catch (error) {}
    relatedProduct = await Productmodel.aggregate([
      {
        $match: { category: { $in: product.category } },
      },
    ]);
    if (totalprice.length === 0) {
      totalprice = [{ _id: null, totalprice: 0 }];
    }
    res.render("singleproduct", {
      product,
      newArray: relatedProduct,
      user,
      totalprice: totalprice[0],
    });
  } catch (error) {
    res.status(404);
  }
});

// ADD PRODUCT
router.post(
  "/addproduct",
  Upload.fields([
    { name: "PngImg", maxCount: 1 },
    { name: "img", maxCount: 7 },
  ]),
  async function (req, res) {
    let inputPath = req.files.PngImg[0].path;
    if (req.files.PngImg[0].mimetype === "image/webp") {
      const result = await webp.dwebp(
        inputPath,
        `${inputPath.split(".")[0]}.jpeg`,
        "-o",
        (logging = "-v")
      );
      fs.unlinkSync(inputPath);

      inputPath = `${inputPath.split(".")[0]}.jpeg`;
    }

    const formData = new FormData();
    formData.append("size", "auto");
    formData.append(
      "image_file",
      fs.createReadStream(inputPath),
      path.basename(inputPath)
    );

    const resp = await axios({
      method: "post",
      url: "https://api.remove.bg/v1.0/removebg",
      data: formData,
      responseType: "arraybuffer",
      headers: {
        ...formData.getHeaders(),
        "X-Api-Key": "vtQAxj4PnkVG8nj4xj46BvA8",
      },
      encoding: null,
    });
    if (resp) {
      fs.writeFileSync(inputPath, resp.data);
    }
    const imgarr = req.files.img.map((img) => {
      return img.filename;
    });

    const { title, desc, price, color, category, size } = req.body;
    let product = await Productmodel.create({
      title,
      desc,
      img: imgarr,
      PngImg: inputPath.split("\\")[3],
      price,
      category,
      color,
      size,
    });

    res.redirect(req.headers.referer);
  }
);

module.exports = router;
