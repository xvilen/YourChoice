//LINK all the required stuff
var express = require("express");
const Usermodel = require("../Models/usersModel");
const Productmodel = require("../Models/ProductModel");
const Cartmodel = require("../Models/cartModel");
const { ideahub } = require("googleapis/build/src/apis/ideahub");
const Ordermodel = require("../Models/Ordermodel");
const totalPrice = require("../Functions/Totalprice").totalPrice;
const stripe = require("stripe")(process.env.STRIPE_KEY);
var router = express.Router();
router.post("/create-checkout-session", async (req, res) => {
  req.body.item = [req.body.item].flat();
  // console.log(req.body.item);
  let items = [];
  for (let i = 0; i < req.body.item.length; i++) {
    let temp = await Cartmodel.findById(req.body.item[i]);
    items.unshift(temp);
  }

  let AllItem = [];
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let product = await stripe.products.create({
      name: item.ProductName,
      metadata: {
        userId: String(item.userId),
        productId: String(item.ProductId),
        ProductImg: String(item.ProductImg),
        ProductColor: String(item.ProductColor),
        ProductSize: String(item.ProductSize),
      },
    });

    t = {
      price_data: {
        currency: "inr",
        product: product.id,
        unit_amount: item.ProductPrice * 100,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10,
      },
      quantity: item.ProductQuantity,
    };
    AllItem.push(t);
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "inr",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "inr",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
          },
        },
      ],
      line_items: AllItem,
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${process.env.DOMAIN_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN_URL}/payment/cancel`,
    });
    res.redirect(session.url);
    // res.redirect(req.headers.referer);
  } catch (error) {
    console.log(error);
  }
});
router.get("/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(
    req.query.session_id,
    {
      expand: ["line_items", "shipping_rate", "customer"],
    }
  );
  let products = [];
  for (let i = 0; i < session.line_items.data.length; i++) {
    const product = await stripe.products.retrieve(
      session.line_items.data[i].price.product
    );
    session.line_items.data[i].price.product = product;
  }
  console.log(req.session.passport.user)
  let user=await Usermodel.findOne({username:req.session.passport.user})
  

let address={
  PaymentType: session.payment_method_types[0],
  CustomerEmail: session.customer_details.email,
  CustomerName: session.customer_details.name,
  CustomerNumber: session.customer_details.phone,
  ShippingAddress: session.customer_details.address,
  ShippingType:{
    ShippingTitle:session.shipping_rate.display_name,
    ShippingAmount:session.shipping_rate.fixed_amount.amount/100,
    MinimumDays:session.shipping_rate.delivery_estimate.minimum.value,
    MaximumDays:session.shipping_rate.delivery_estimate.maximum.value
  }
}
let arr=session.line_items.data.map((products)=>{
  let obj={
    userId: products.price.product.metadata.userId,
    ProductId: products.price.product.metadata.productId,
    ProductImg: products.price.product.metadata.ProductImg,
    ProductName: products.price.product.name,
    ProductColor: products.price.product.metadata.ProductColor,
    ProductSize: products.price.product.metadata.ProductSize,
    ProductQuantity: products.quantity,
    ProductSubtotal: products.amount_subtotal/100,
    ProductDiscount: products.amount_discount/100,
    ProductTotal: products.amount_total/100,
    ProductUnitAmount: products.price.unit_amount/100,
    ...address
  }
  return obj
})
console.log(user)
user.cart.splice(0,user.cart.length)
let orderArray=[];
for (let i = 0; i < arr.length; i++) {
  let holder=await Ordermodel.create(arr[i])
  user.orders.push(holder._id)
  orderArray.push(holder)
  
}
await user.save()
  res.redirect("/cart/usercart");
});
module.exports = router;
