const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db.js");

//Loading environment variables from .env file
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectDB();

//Route files
const auth = require("./routes/auth");
const all = require("./routes/all");
const cities = require("./routes/cities");
const requests = require("./routes/requests");
const downloads = require("./routes/downloads");

//intializing app variable with express
const app = express();

//cors middleware
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
}

//Body parser middleware
app.use(express.json());

//Prevent NoSQL injection middlware
app.use(mongoSanitize());

//Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Mount routers or linking routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/all", all);
app.use("/api/v1/cities", cities);
app.use("/api/v1/:slotId/requests", requests);
app.use("/api/v1/downloads/certificate", downloads);

//Error handling middleware
app.use(errorHandler);

//start running server by listening to port
const port = process.env.PORT || 3001;
const server = app.listen(port, () =>
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  //closing servers and exit process
  server.close(() => process.exit(1));
});
