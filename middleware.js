const Listing = require("./models/listingModel");
const Review = require("./models/reviewsModel");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to perform this action.");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isAuthorized = async (req, res, next) => {
  const findId = req.params.id;
  const listing = await Listing.findById(findId);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you dont have permission to edit");
    return res.redirect(`/listings/${findId}`);
  }
  next();
};

const isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isAuthorized,
  isReviewOwner,
};
