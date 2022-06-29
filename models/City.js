const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "City name is required"],
    unique: true,
  },
  population: {
    type: Number,
    default: 10,
  },
  isMetroPolitan: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Number,
    default: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("City", CitySchema);
