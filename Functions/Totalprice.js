const Cartmodel = require("../Models/cartModel");

function totalPrice(id) {
  return new Promise(async function (resolve, reject) {
    totalp = await Cartmodel.aggregate([
      {
        $lookup: {
          from: "users",
          as: "user",
          localField: "userId",
          foreignField: "_id",
        },
      },
      {
        $match: {
          _id: {
            $in: id,
          },
        },
      },
      {
        $addFields: {
          totalprice: {
            $multiply: ["$ProductPrice", "$ProductQuantity"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalprice: { $sum: "$totalprice" },
        },
      },
    ]);

    if (totalp) {
      resolve(totalp);
    } else {
      reject("error");
    }
  });
}
module.exports.totalPrice = totalPrice;
