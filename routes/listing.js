const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync");
const Listing = require("../models/listings.js");
const mongoose = require("mongoose");
const {isLoggedin, isOwner, validateListing}= require("../middleware.js");
const listingController= require("../controllers/listings.js");
const {storage}= require("../cloudConfig.js")
const multer= require("multer");
const upload= multer({storage})


// Utility functions
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function cleanObjectId(id) {
  return id.trim(); // Clean any extra spaces from the ID
}

// Listing Validation Error Middleware

// Routes

router.route("/").get(wrapAsync(listingController.index))
.post(
  isLoggedin,
  
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// New route (Create new listing form)
router.get("/new", isLoggedin, listingController.renderNewForm);

// Show route (Show a single listing by ID)
router.get("/:id",wrapAsync(listingController.showListing));

// Edit route (Render form to edit a listing)
router.get(
  "/:id/edit",isLoggedin,isOwner,
  wrapAsync(listingController.renderEditform)
);

// Update route (Update a listing)
router.put(
  "/:id",isLoggedin,isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete route (Delete a listing)
router.delete(
  "/:id",isLoggedin,isOwner,
  wrapAsync(listingController.deleteListing)
);


module.exports = router;