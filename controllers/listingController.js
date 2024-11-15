const Listing = require("../models/listingModel");
const mongoose = require("mongoose");
const expressError = require("../utils/expressError");
const Review = require("../models/reviewsModel");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { options } = require("joi");
const { query } = require("express");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

const getListings = async (req, res, next) => {
  try {
    const listing = await Listing.find({});
    res.render("listing", { listing, query: "" });
    // res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

const getlistId = async (req, res) => {
  try {
    const findId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(findId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const listId = await Listing.findById(findId)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listId) {
      req.flash("error", "Listing you are requesting for does not exist");
      res.redirect("/listings");
    }
    res.render("showId", { listId });
  } catch (err) {
    console.log(err);
  }
};

const newList = (req, res) => {
  res.render("newListing");
};

const newListing = async (req, res, next) => {
  try {
    let response = await geoCodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    newList.geometry = response.body.features[0].geometry;
    let savedListing = await newList.save();
    req.flash("success", "listing created successfully");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

const editList = async (req, res, next) => {
  try {
    const findId = req.params.id;
    const findList = await Listing.findById(findId);
    if (!findList) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = findList.image.url;
    originalImageUrl = originalImageUrl.replace(
      "/upload",
      "/upload/h_100,w_150"
    );
    res.render("edit", { findList, originalImageUrl });
  } catch (err) {
    next(err);
  }
};

const updateList = async (req, res, next) => {
  try {
    const findId = req.params.id;
    const updateList = await Listing.findByIdAndUpdate(findId, {
      ...req.body.listing,
    });
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      updateList.image = { url, filename };
    }
    await updateList.save();
    req.flash("success", "listing Updated successfully");
    res.redirect(`/listings/${findId}`);
  } catch (err) {
    next(err);
  }
};

const deleteList = async (req, res, next) => {
  try {
    const findId = req.params.id;
    const deleteList = await Listing.findByIdAndDelete({ _id: findId });
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

const searchListing = async (req, res, next) => {
  try {
    const query = req.query.query;
    const searchCriteria = {};
    if (query) {
      const words = query.split(" ");
      //lopp through words to determine search criteria
      words.forEach((word) => {
        //check for numbers
        if (!isNaN(word)) {
          searchCriteria.price = { $lte: Number(word) };
        } else {
          //treat the word as location or title
          searchCriteria.$or = [
            { location: { $regex: word, $options: "i" } },
            { title: { $regex: word, $options: "i" } },
          ];
        }
      });
    }
    const listing = await Listing.find(searchCriteria);
    //render
    res.render("listing", { listing, query });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
  getlistId,
  newList,
  newListing,
  editList,
  updateList,
  deleteList,
  searchListing,
};
