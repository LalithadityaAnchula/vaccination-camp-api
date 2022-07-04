const THREE_HUNDRED_THIRTY_MINUTES_IN_MS = 19800000;

const getSlotTime = (slotDate, slotType) => {
  if (slotType === "morning") {
    //add 9 hours
    const NINE_HOURS_IN_MS = 32400000;
    slotDate += NINE_HOURS_IN_MS;
  } else if (slotType === "afternoon") {
    //add 12 hours
    const TWELVE_HOURS_IN_MS = 43200000;
    slotDate += TWELVE_HOURS_IN_MS;
  } else if (slotType === "evening") {
    //add 17 hours
    const SEVENTEEN_HOURS_IN_MS = 61200000;
    slotDate += SEVENTEEN_HOURS_IN_MS;
  }
  //Subtracting and returning mongoDB time
  return slotDate - THREE_HUNDRED_THIRTY_MINUTES_IN_MS;
};

const getSlotEndTime = (slotDate, slotType) => {
  if (slotType === "morning") {
    //add 11 hours
    const ELEVEN_HOURS_IN_MS = 39600000;
    slotDate += ELEVEN_HOURS_IN_MS;
  } else if (slotType === "afternoon") {
    //add 14 hours
    const FOURTEEN_HOURS_IN_MS = 50400000;
    slotDate += FOURTEEN_HOURS_IN_MS;
  } else if (slotType === "evening") {
    //add 19 hours
    const NINETEEN_HOURS_IN_MS = 68400000;
    slotDate += NINETEEN_HOURS_IN_MS;
  }
  //Subtracting and returning mongoDB time
  console.log(slotDate);
  return slotDate - THREE_HUNDRED_THIRTY_MINUTES_IN_MS;
};

module.exports = { getSlotTime, getSlotEndTime };
