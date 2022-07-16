const mongoose = require("mongoose");

const productModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    img: [
      {
        type: String,
        required: true,
      },
    ],
    PngImg: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    color: [{ type: String }],
    size: [{ type: String }],
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("products", productModel);
