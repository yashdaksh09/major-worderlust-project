const Listing= require("./models/listings");
const Review= require("./models/review");
const ExpressError = require("./utlis/ExpressError.js");
const { listingSchema, reviewSchema} = require("./view/schema.js"); // Joi schema for validation
module.exports.isLoggedin= (req, res, next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl= req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        return res.redirect("/login");
      }
      next()
}


module.exports.savedRedirectUrl=(req, res, next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner= async(req, res, next)=>{
  const {id}= req.params;
  const listing= await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next()
}
// Validate listing middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(error, 400);
  } else {
    next();
  }
};

// Review Validation Error Middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errmsg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor= async(req, res, next)=>{
  const {id, reviewId}= req.params;
  const review= await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){ // is check if the logged in user is the author of the review
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next()
}