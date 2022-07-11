const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
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

//Body parser middleware
app.use(express.json());

//options for session cookie
let options = { maxAge: 1000 * 60 * 60 * 24 * 7 }; // 7 days validity (1000 * MINS * SECS * HOURS * DAYS ->7 days in  milliseconds)};
if (process.env.NODE_ENV === "production") {
  options.secure = true;
  options.sameSite = "Strict";
}

//express session middleware
app.use(
  session({
    name: "_iamsid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: process.env.MONGO_URI,
      collection: "sessions",
    }),
    cookie: {
      ...options,
    },
  })
);

//Cookie Parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Prevent NoSQL injection middlware
app.use(mongoSanitize());

//Set secure headers using helmet middleware
app.use(helmet());

//Set xss middleware
app.use(xss());

if (process.env.NODE_ENV === "production") {
  // Apply the rate limiting middleware to all requests
  const limiter = rateLimit({
    windowMs: 4 * 60 * 1000, // 4 minutes
    max: 200, // Limit each IP to 200 requests per `window` (here, per 4 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use(limiter);
}

//Preventing HTTP Parameter pollution
app.use(hpp());

//cors middleware
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
