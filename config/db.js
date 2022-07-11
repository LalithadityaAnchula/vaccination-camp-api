const mongoose = require("mongoose");

//conect to mongoDB
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {});
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  const db = await mongoose.connection.db;
  // db.collection("users")
  //   .find({})
  //   .toArray(function (err, result) {
  //     if (err) throw err;
  //     console.log(result);
  //   });
};

module.exports = connectDB;
