const mongoose = require("mongoose");

const CampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Camp name is required"],
    unique: true,
  },
  city: {
    type: mongoose.Schema.ObjectId,
    ref: "City",
    required: [true, "City id is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    unique: true,
  },
  vaccinationStock: {
    firstDose: {
      type: Number,
      default: 0,
    },
    secondDose: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Camp", CampSchema);
