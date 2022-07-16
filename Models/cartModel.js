const mongoose = require("mongoose");
const Product = require("./ProductModel");

const Cartmodel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ProductImg: {
      type: String,
    },
    ProductName: {
      type: String,
    },
    ProductColor: {
      type: String,
    },
    ProductSize: {
      type: String,
    },
    ProductQuantity: {
      type: Number,
      default: 1,
    },
    ProductPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("carts", Cartmodel);
