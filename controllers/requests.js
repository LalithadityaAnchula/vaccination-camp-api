const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Request = require("../models/Request");
const User = require("../models/User");
const Camp = require("../models/Camp");
const getSlotTime = require("../utils/dateUtils");

//@desc  Get all requests
//@route GET /api/v1/:slotId/requests
//@access Private

exports.getRequests = asyncHandler(async (req, res, next) => {
  const requests = await Request.find({ slot: req.params.slotId }).populate([
    "slot",
    "user",
  ]);
  res.status(200).json({ success: true, data: requests });
});

//@desc  Get all requests
//@route GET /api/v1/:slotId/requests/:requestId
//@access Private

exports.acceptRequest = asyncHandler(async (req, res, next) => {
  const request = await Request.findById(req.params.requestId).populate([
    {
      path: "slot",
      model: "Slot",
      populate: {
        path: "camp",
        model: "Camp",
        populate: { path: "city", model: "City" },
      },
    },
    "user",
  ]);

  if (!request)
    return next(
      new ErrorResponse(
        `Request not found with id ${req.params.requestId}`,
        404
      )
    );

  if (getSlotTime(request.date, request.slot.slotType) > new Date().getTime()) {
    return next(
      new ErrorResponse(`You cannot accept request before the slot time`, 400)
    );
  }

  const camp = await Camp.findById(request.slot.camp._id);

  if (!camp)
    return next(
      new ErrorResponse(`Camp not found with id ${request.slot.camp._id}`, 404)
    );

  let doc = {};

  if (request.slot.doseType === 1) {
    const userObj = {
      $unset: { activeSlot: "" },
      firstDose: { ...request.slot.toObject() },
    };
    doc = await User.findOneAndUpdate(
      { _id: request.user._id }, //filter
      userObj, //update
      {
        //options
        returnNewDocument: true,
        new: true,
        strict: false,
      }
    );
    camp.vaccinationStock.firstDose -= 1;
  } else if (request.slot.doseType === 2) {
    const userObj = {
      $unset: { activeSlot: "" },
      secondDose: { ...request.slot.toObject() },
    };
    doc = await User.findOneAndUpdate(
      { _id: request.user._id }, //filter
      userObj, //update
      {
        //options
        returnNewDocument: true,
        new: true,
        strict: false,
      }
    );
    camp.vaccinationStock.secondDose -= 1;
  }
  await camp.save();
  await request.remove();
  res.status(200).json({ success: true, data: request });
});
