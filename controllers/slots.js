const ErrorResponse = require("../utils/errorResponse");
const { getSlotTime } = require("../utils/dateUtils");
const asyncHandler = require("../middleware/async");
const Slot = require("../models/Slot");
const Camp = require("../models/Camp");
const User = require("../models/User");
const Request = require("../models/Request");

//@desc  Get all slots
//@route GET /api/v1/camps/:campId/slots
//@access Private
exports.getSlots = asyncHandler(async (req, res, next) => {
  req.user = req.user.toObject();
  let dontSendSlot = req.user._id;
  let slots = [];
  if (req.user.role == "user") {
    if (req.user.firstDose && req.user.secondDose) {
      return next(
        new ErrorResponse(`No slots available for users who are vaccinated`)
      );
    }
    const requests = await Request.find({ user: req.user._id });
    if (requests.length > 0) {
      dontSendSlot = requests[0].slot._id;
    }
    if (req.user.firstDose) {
      slots = await Slot.find({
        doseType: 2,
        camp: req.params.campId,
        available: { $gt: 0 },
        date: { $gt: new Date().getTime() + 3888000000 },
        _id: { $ne: dontSendSlot },
      }).populate("camp");
    } else {
      slots = await Slot.find({
        camp: req.params.campId,
        available: { $gt: 0 },
        date: { $gt: new Date().getTime() },
        _id: { $ne: dontSendSlot },
      }).populate("camp");
    }
  } else if (req.user.role == "admin") {
    slots = await Slot.find({
      camp: req.params.campId,
    }).populate("camp");
  }
  res.status(200).json({ success: true, data: slots });
});

//@desc  create one slots
//@route POST /api/v1/camps/:campId/slots
//@access Private
exports.createSlot = asyncHandler(async (req, res, next) => {
  //Convert to milliseconds and set time according to slotTypes
  req.body.date = getSlotTime(
    new Date(req.body.date).getTime(),
    req.body.slotType
  );
  // Check if slot creation time is valid
  if (req.body.date < new Date().getTime()) {
    return next(new ErrorResponse("Cant create slot in the past", 400));
  }
  //Check existence of camp
  const camp = await Camp.findById(req.params.campId);
  //return 404 if camp is not found
  if (!camp)
    return next(
      new ErrorResponse(`Camp not found with id ${req.params.campId}`, 404)
    );
  //create only if stock is available
  if (req.body.doseType === 1 && camp.vaccinationStock.firstDose < 10) {
    return next(new ErrorResponse(`Not enough first dose stock`, 401));
  } else if (req.body.doseType === 2 && camp.vaccinationStock.secondDose < 10) {
    return next(new ErrorResponse(`Not enough second dose stock`, 401));
  }
  //add camp id to body
  const slots = await Slot.find({
    camp: req.params.campId,
    date: req.body.date,
  });
  //Cant create more than 3 slots
  if (slots.length === 3)
    return next(new ErrorResponse(`Camp already has 3 slots`, 400));
  //Cant have same slot type in a same day
  slots.forEach((slot) => {
    if (slot.slotType === req.body.slotType)
      return next(
        new ErrorResponse(`Slot type ${req.body.slotType} already exists`, 400)
      );
  });
  //Setting camp id as referrence to slot
  req.body.camp = req.params.campId;
  //create slot
  const slot = await Slot.create(req.body);
  res.status(201).json({ success: true, data: slot });
});

//@desc  Get  slot
//@route GET /api/v1/slots/:slotId
//@access Private
exports.getSlot = asyncHandler(async (req, res, next) => {
  const slot = Slot.findById(req.params.campId);
  if (!slot)
    return next(
      new ErrorResponse(`Slot not found with id ${req.params.campId}`, 404)
    );
  res.status(200).json({ success: true, data: slot });
});

//@desc  Book slot
//@route GET /api/v1/slots/:slotId/book
//@access Private
exports.bookSlot = asyncHandler(async (req, res, next) => {
  req.user = req.user.toObject();
  //Searchiing for user in requests
  const requests = await Request.find({ user: req.user._id });
  //checking if user already has request
  if (requests.length > 0)
    return next(new ErrorResponse(`You already have a request`, 400));
  //Checking if the user is vaccinated
  if (req.user.firstDose && req.user.secondDose) {
    return next(new ErrorResponse(`User already has 2 doses`, 400));
  }
  //getting slot
  const slot = await Slot.findById(req.params.slotId);
  //checkingslot
  if (!slot)
    new next(
      new ErrorResponse(`Slot not found with id ${req.params.slotId}`, 404)
    );
  //check if slot is available
  if (slot.available === 0) {
    return next(new ErrorResponse(`Slot is full`, 400));
  }
  if (getSlotTime(slot.date, slot.slotType) <= new Date().getTime()) {
    return next(
      new ErrorResponse("you cant book a slot after it started", 400)
    );
  }
  //validations for taking dose 1
  if (slot.doseType === 1) {
    if (req.user.firstDose !== undefined)
      return next(new ErrorResponse("You already took a first dose", 400));
  }
  //validations for taking second dose
  if (slot.doseType === 2) {
    if (req.user.firstDose === undefined)
      return next(
        new ErrorResponse(`You dont have a first dose vaccination`, 400)
      );
    else if (
      slot.date.getTime() <
      new Date(req.user.firstDose.date).setDate(slot.date.getDate() + 45)
    ) {
      return next(
        new ErrorResponse(`You should wait for 45 days to get second dose`, 400)
      );
    }
  }

  //creating activeSlot
  await User.findOneAndUpdate(
    { _id: req.user._id }, //filter
    { activeSlot: { ...slot } }, //data to update
    {
      //options
      returnNewDocument: true,
      new: true,
      strict: false,
    }
  );
  slot.available -= 1;
  await slot.save();
  await Request.create({
    user: req.user._id,
    slot: req.params.slotId,
    date: slot.date,
  });
  res.status(200).json({ success: true, data: slot });
});

//@desc  Update one slot
//@route PUT /api/v1/camps/:campId/slots/:slotId
//@access Private
exports.updateSlot = asyncHandler(async (req, res, next) => {
  let slot = await Slot.findById(req.body.slotId);
  if (!slot)
    return next(
      new ErrorResponse(`Slot not found with id ${req.params.campId}`, 404)
    );
  if (slot.available === 0) return next(new ErrorResponse(`Slot is full`, 400));
  let user = await User.findById(req.body.userId);
  if (!user) return next(new ErrorResponse(`User not found`, 404));
  console.log(slot._id, "booked");
  res.status(200).json({ success: true, data: slot });
});
