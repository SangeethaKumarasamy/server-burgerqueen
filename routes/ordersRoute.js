const express = require("express");
const router = express.Router();
const { uuid } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KapTVSFyJXvMzrW9ppzEgmtiOTVqvwrk81QS3GVSqgbqe2P7oY5HHvdIKxOnZkQUMl9TSMQurlyBDq72IN8C5vF00vdudQzpq"
);
const Order = require("../Models/orderModel");

router.post("/placeorder", async (req, res) => {
  const { token, subtotal, currentUser, cartItems } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: subtotal * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuid(),
      }
    );
    if (payment) {

      const newOrder=new Order({
        name:currentUser.name,
        email:currentUser.email,
        userid:currentUser.userid,
        orderItems:cartItems,
        orderAmount:subtotal,
        shippingAddress:{
           street:token.card.address_line1,
           city:token.card.address_city,
           country:token.card.address_country,
           pincode:token.card.address_zip,
        },
        transactionId
      })
      res.send("Payment Done !!");
    } else {
      res.send("Payment Failed !!");
    }
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong !!" + error });
  }
});
module.exports = router;
