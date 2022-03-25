const express = require("express");

const Burger = require("./Models/burgerModel");

const db = require("./db.js");

//Paytm part//
const qs = require("querystring");
const app = express();
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//*** //


app.use(express.json());

const burgerRoute = require("./routes/burgerRoute");

const userRoute = require("./routes/userRoute");

const ordersRoute=require("./routes/ordersRoute");

app.use("/api/burgers/", burgerRoute);

app.use("/api/users/", userRoute);

app.use("/api/orders/", ordersRoute);

app.get("/", (req, res) => {
  res.send("Server Working : " + port);
});

// app.get("/getburgers", (req, res) => {
//   Burger.find({}, (err, docs) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(docs);
//     }
//   });
// });

const port = process.env.PORT || 7000;

app.listen(port, () => "Server running on port " + port);
