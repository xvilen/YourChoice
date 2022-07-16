const mongoose = require("mongoose");
const cart = require("./cartModel");

const Cartmodel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
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
    },
    ProductPrice: {
      type: Number,
    },
    OrderStatus: {
      type: String,
      default: "Ordered",
    },
    Address: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("carts", Cartmodel);
