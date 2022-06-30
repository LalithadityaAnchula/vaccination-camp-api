const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User id is required"],
  },
  slot: {
    type: mongoose.Schema.ObjectId,
    ref: "Slot",
    required: [true, "Slot id is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    expires: "2h",
  },
});

module.exports = mongoose.model("Request", RequestSchema);
