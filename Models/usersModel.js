const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/YourChoice", () => {
  console.log("connected");
});
// mongoose.connect(process.env.MONGO_URL, () => {
//   console.log("connected");
// });

const addressSchema = mongoose.Schema({
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  addressType: {
    type: String,
  },
});
const orderSchema = mongoose.Schema({
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  addressType: {
    type: String,
  },
});
const Usermodel = mongoose.Schema(
  {
    img: {
      type: String,
      default:
        "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png",
    },
    name: { type: String, require: true },
    GoogleId: { type: String, default: null },
    username: { type: String, require: true, unique: true },
    password: { type: String, default: null },
    number: { type: Number, default: null },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "carts" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    address: {
      type: addressSchema,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", Usermodel);
