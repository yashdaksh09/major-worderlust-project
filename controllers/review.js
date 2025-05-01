const Listing= require("../models/listings");
const Review= require("../models/review");

module.exports.createReview=(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;  // Assign author before saving 
    await newReview.save();

    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review Added Successfully");
    res.redirect(`/listings/${listing._id}`); // Fixed redirection 
})

module.exports.reviewDelete=(async (req, res) => {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("error", "Review Deleted Successfully");
    res.redirect(`/listings/${id}`); // Fixed redirection 
})