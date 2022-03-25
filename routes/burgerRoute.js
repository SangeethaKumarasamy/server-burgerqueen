const express = require("express");
const router = express.Router();
const Burger = require("../Models/burgerModel");

router.get("/getallburgers", async (req, res) => {
  try {
    const burgers = await Burger.find({});
    res.send(burgers);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/addburger", async (req, res) => {
  const burger = req.body.burger;
  try {
    const newBurger = new Burger({
      name: burger.name,
      variants: ["Quarter", "Double", "Big_Mac"],
      image: burger.image,
      description: burger.description,
      category: burger.category,
      prices: [burger.prices],
    });
    await newBurger.save();
    res.send("New burger added successfully !!");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/", async (req, res) => {
  const burgerid = req.body.burgerid;
  try {
    const burger = await Burger.findOne({ _id: burgerid });
    res.send(burger);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
