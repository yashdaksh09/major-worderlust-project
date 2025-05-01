const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utlis/wrapAsync.js");
const ExpressError = require("../utlis/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware.js");
const reviewController= require("../controllers/review.js")

// Post Route (Add Review)
router.post("/", isLoggedin, validateReview, wrapAsync(reviewController.createReview));

// Review Delete Route
router.delete("/:reviewId", isLoggedin,isReviewAuthor, wrapAsync(reviewController.reviewDelete));

module.exports = router;
