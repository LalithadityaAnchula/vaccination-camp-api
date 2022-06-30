const mongoose = require("mongoose");

const SlotSchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "Date is required"],
    expires: "2h",
  },
  available: {
    type: Number,
    default: 10,
  },
  slotType: {
    type: String,
    enum: ["morning", "afternoon", "evening"],
    required: [true, "Slot type is required"],
  },
  doseType: {
    type: Number,
    enum: [1, 2],
    required: [true, "Dose type is required"],
  },
  camp: {
    type: mongoose.Schema.ObjectId,
    ref: "Camp",
    required: [true, "Camp id is required"],
  },
});

module.exports = mongoose.model("Slot", SlotSchema);
