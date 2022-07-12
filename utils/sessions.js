const mongoose = require("mongoose");

const getActiveSessionsOfUser = async (userId) => {
  const db = mongoose.connection.db;
  let sessions = await db
    .collection("sessions")
    .find({ session: new RegExp(`"userId":"${userId}",`, "i") })
    .toArray();
  sessions = sessions.map((session) => {
    const sessionObj = JSON.parse(session.session);
    return {
      id: session._id,
      ua: sessionObj.ua,
    };
  });
  return sessions;
};

module.exports = getActiveSessionsOfUser;
