const convertToIST = (date) => {
  let currentTime = new Date(date);

  let currentOffset = currentTime.getTimezoneOffset();

  let ISTOffset = 330; // IST offset UTC +5:30

  let ISTTime = new Date(
    currentTime.getTime() + (ISTOffset + currentOffset) * 60000
  );

  return ISTTime;
};

const getSlotTime = (slotDate, slotType) => {
  let date = convertToIST(slotDate);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  if (slotType === "morning") {
    date.setHours(9);
  } else if (slotType === "afternoon") {
    date.setHours(12);
  } else if (slotType === "evening") {
    date.setHours(17);
  } else {
    date.setHours(0);
  }
  return date.getTime();
};

const getSlotEndTime = (slotDate, slotType) => {
  let date = convertToIST(slotDate);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  if (slotType === "morning") {
    date.setHours(11);
  } else if (slotType === "afternoon") {
    date.setHours(14);
  } else if (slotType === "evening") {
    date.setHours(19);
  } else {
    date.setHours(0);
  }
  return date.getTime();
};

module.exports = { getSlotTime, getSlotEndTime };
