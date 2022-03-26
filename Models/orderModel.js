const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
  {
    name: { type: String, require },
    email: { type: String, require },
    userid: { type: String, require },
    orderItems: [],
    shippingAddress: { type: Object },
    orderAmount: { type: Number, require },
    isDelivered: { type: Boolean, require ,default: false },
    orderStatus:{type: String, require,default:"PENDING"} // "PENDING,ACCEPTED,DELIVERED"
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("orders", orderSchema);
