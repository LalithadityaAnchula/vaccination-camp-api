const getSlotTime = (slotDate, slotType) => {
  if (slotType === "morning") {
    //add 9 hours
    slotDate += 32400000;
  } else if (slotType === "afternoon") {
    //add 12 hours
    slotDate += 43200000;
  } else if (slotType === "evening") {
    //add 17 hours
    slotDate += 61200000;
  }
  //Subtracting and returning mongoDB time
  return slotDate - 19800000;
};

const getSlotEndTime = (slotDate, slotType) => {
  if (slotType === "morning") {
    //add 11 hours
    slotDate += 39600000;
  } else if (slotType === "afternoon") {
    //add 14 hours
    slotDate += 50400000;
  } else if (slotType === "evening") {
    //add 19 hours
    slotDate += 68400000;
  }
  //Subtracting and returning mongoDB time
  return slotDate - 19800000;
};

module.exports = { getSlotTime, getSlotEndTime };
