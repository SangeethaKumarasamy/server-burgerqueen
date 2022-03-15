const mongoose = require("mongoose");

var MONGO_URL =
  "mongodb+srv://sangeetha:sangeetha123@cluster0.kl6wa.mongodb.net/burger";

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
