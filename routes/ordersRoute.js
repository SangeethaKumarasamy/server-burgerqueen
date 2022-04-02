const express = require("express");
const router = express.Router();
const { uuid } = require("uuid");
const Order = require("../Models/orderModel");

router.post("/placeorder", async (req, res) => {
  const { subtotal, currentUser, cartItems } = req.body;
  const {status}=req.query;
  if(status){
    try {
      const newOrder = new Order({
        name: currentUser.name,
        email: currentUser.email,
        userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subtotal,
        shippingAddress: {
          street: "address_line1",
          city: "address_city",
          state: "address_state",
          pincode: "address_zip",
        },
      });
      newOrder.save();
      res.send("Order Placed Successfully !!");
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong !!" + error });
  }

  }else{
    res.status(400).json({ message: "Something went wrong !!" });
  
  }
});


router.post("/getuserorders", async (req, res) => {
  const { userid } = req.body;
  try {
    const orders = await Order.find({ userid: userid }).sort({ _id: -1 });
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/getallorders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/deliverorder", async (req, res) => {
  const orderid = req.body.orderid;
  try {
    const order = await Order.findOne({ _id: orderid });
    order.isDelivered = true;
    await order.save();
    res.send("Order is delivered successfully !!");
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong !!" });
  }
});
module.exports = router;
