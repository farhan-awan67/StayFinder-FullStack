const express = require("express");
const router = express.Router();
const {
  signUser,
  signedUser,
  loginUser,
  userLogin,
  logoutUser,
} = require("../controllers/userController");
const errorHandling = require("../middlewares/errorHandling");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.use(errorHandling);

router.get("/signup", signUser);
router.post("/signup", signedUser);
router.get("/login", loginUser);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userLogin
);
router.get("/logout", logoutUser);

module.exports = router;
