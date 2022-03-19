const express = require("express");
const router = express.Router();
const { uuid } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KapTVSFyJXvMzrW9ppzEgmtiOTVqvwrk81QS3GVSqgbqe2P7oY5HHvdIKxOnZkQUMl9TSMQurlyBDq72IN8C5vF00vdudQzpq"
);

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
      res.send("Payment Done !!");
    } else {
      res.send("Payment Failed !!");
    }
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong !!"+ error });
  }
});
module.exports = router;
