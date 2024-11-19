if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const connectDB = require("./db");
const listingRoute = require("./routes/listingRoute");
const methodOverride = require("method-override");
const reviewRoute = require("./routes/reviewRoute");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/userModel");
const userRouter = require("./routes/userRoute");
const expressError = require("./utils/expressError");

const dbUrl = process.env.MONGO_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "process.env.SESSION_SECRET",
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: "process.env.SESSION_SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(sessions(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.welcome = req.flash("welcome");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRouter);

// 404 handler for undefined routes
app.all("*", (req, res, next) => {
  res.status(404).json({ success: false, message: "page not found" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`server running on ${PORT}`);
});
