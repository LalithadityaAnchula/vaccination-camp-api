const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

//conect to mongoDB
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {});
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  const db = await mongoose.connection.db;
};

module.exports = connectDB;
