const mongoose = require("mongoose");

const getActiveSessionsOfUser = async (req, userId) => {
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
      current: session._id === req.session.id,
    };
  });
  return sessions;
};

module.exports = getActiveSessionsOfUser;
