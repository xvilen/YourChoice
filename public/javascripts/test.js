let a = {
  order: {
    OrderConfirmed: true,
    Shipped: false,
    OutForDelivery: false,
    Delivered: false,
  },
};
for (const key in a.order) {
  console.log(key);
}
