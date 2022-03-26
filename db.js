const mongoose = require("mongoose");
require("dotenv").config();

var MONGO_URL = process.env.DB_URL;

mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
var db = mongoose.connection;

db.on("connected", () => {
  console.log("MongoDb Connected!!");
});

db.on("error", () => {
  console.log("MongoDb Connection Failed");
});

module.exports = mongoose;
