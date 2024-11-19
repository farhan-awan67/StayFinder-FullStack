const Listing = require("../models/listingModel");
const expressError = require("../utils/expressError");
const Review = require("../models/reviewsModel");

const addReview = async (req, res, next) => {
  try {
    const findId = req.params.id;
    const listing = await Listing.findById(findId);
    const newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${findId}`);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    let findList = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    let findReview = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addReview,
  deleteReview,
};
