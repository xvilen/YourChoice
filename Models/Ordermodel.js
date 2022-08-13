const mongoose = require("mongoose");
const cart = require("./cartModel");

const Ordermodel = mongoose.Schema(
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
    ProductSubtotal: {
      type: Number,
    },
    ProductDiscount: {
      type: Number,
    },
    ProductTotal: {
      type: Number,
    },
    ProductUnitAmount: {
      type: Number,
    },
    PaymentType: {
      type: String,
    },
    OrderStatus: {
      OrderConfirmed: {
        type: Boolean,
        default: true,
      },
      Shipped: {
        type: Boolean,
        default: false,
      },
      OutForDelivery: {
        type: Boolean,
        default: false,
      },
      Delivered: {
        type: Boolean,
        default: false,
      },
    },
    CustomerEmail: {
      type: String,
      required: true,
    },
    CustomerName: {
      type: String,
      required: true,
    },
    CustomerNumber: {
      type: String,
      required: true,
    },
    ShippingAddress: {
      type: Object,
      required: true,
    },
    ShippingType: {
      ShippingTitle: String,
      ShippingAmount: Number,
      MinimumDays: Number,
      MaximumDays: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orders", Ordermodel);
