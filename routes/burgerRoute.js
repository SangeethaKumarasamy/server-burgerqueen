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

router.post("/getburgerbyid", async (req, res) => {
  const burgerid = req.body.burgerid;
  try {
    // const burger = await Burger.findOne({_id:Object(burgerid) });
    console.log(burgerid);
    console.log(req.body);
    const burger = await Burger.findById(burgerid);
    res.send(burger);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/editburger", async (req, res) => {
  const editedburger = req.body.editedburger;
  try {
    const burger = await Burger.findOne({ _id: editedburger._id });
    burger.name = editedburger.name;
    burger.description = editedburger.description;
    burger.image = editedburger.image;
    burger.category = editedburger.category;
    burger.prices = [editedburger.prices];

    await burger.save();
    res.send("Burger is edited successfully !!");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/deletepizza", async (req, res) => {
  const burgerid = req.body.burgerid;
  try {
    await Burger.findOneAndDelete({ _id: burgerid });
    res.send("Burger is deleted successfully !!");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
