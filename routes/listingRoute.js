const express = require("express");
const router = express.Router();
const {
  getListings,
  getlistId,
  newList,
  newListing,
  editList,
  updateList,
  deleteList,
  searchListing,
} = require("../controllers/listingController");
const errorHandling = require("../middlewares/errorHandling");
const expressError = require("../utils/expressError");
const { validateSchema } = require("../validateSchema");
const { isLoggedIn, isAuthorized } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const listingValidation = (req, res, next) => {
  const result = validateSchema.validate(req.body);
  if (result.error) {
    throw new expressError(500, result.error);
  } else {
    next();
  }
};


router.get("/", getListings);
router.get("/newlist", isLoggedIn, newList);
router.get("/search", searchListing);
router.get("/:id", getlistId);
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  listingValidation,
  newListing
);
router.get("/:id/edit", isLoggedIn, isAuthorized, editList);
router.put(
  "/:id/update",
  upload.single("listing[image]"),
  listingValidation,
  isAuthorized,
  updateList
);
router.get("/:id/delete", deleteList);

router.use(errorHandling);

module.exports = router;
