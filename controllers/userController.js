const Listing = require("../models/listingModel");
const expressError = require("../utils/expressError");
const User = require("../models/userModel");

const signUser = (req, res) => {
  res.render("signup");
};

const signedUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already taken");
    }
    const userIn = new User({ username, email });
    const registerUser = await User.register(userIn, password);
    await userIn.save();
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("welcome", "Welcome to stayFindr");
      res.redirect("/listings");
    });
  } catch (err) {
    next(err);
    res.redirect("/signup");
  }
};

//login page
const loginUser = (req, res) => {
  res.render("login");
};

//loging user
const userLogin = (req, res) => {
  req.flash("success", "Welcome back to stayFindr");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout user
const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are logout Successfully");
    res.redirect("/listings");
  });
};

module.exports = {
  signUser,
  signedUser,
  loginUser,
  userLogin,
  logoutUser,
};
