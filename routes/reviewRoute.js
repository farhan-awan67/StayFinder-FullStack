const errorHandling = require("../middlewares/errorHandling");
const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../validateSchema");
const { addReview, deleteReview } = require("../controllers/reviewController");
const { isLoggedIn, isReviewOwner } = require("../middleware");
const expressError = require("../utils/expressError");

const reviewsValidation = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new expressError(400, result.error);
  }
  next();
};

router.post("/", reviewsValidation, isLoggedIn, addReview);
router.delete("/:reviewId", isReviewOwner, deleteReview);

router.use(errorHandling);

module.exports = router;
