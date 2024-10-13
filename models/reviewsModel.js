const mongoose = require("mongoose");
const { max, type } = require("../validateSchema");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const reviewModel = mongoose.model("Reviews", reviewSchema);

module.exports = reviewModel;
