const express = require("express");
// to merge parent route with child route 
const router  = express.Router({mergeParams:true}); 
const wrapAsync =  require("../utility/wrapAsync.js");
const ExpressError = require("../utility/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
// const User = require("../models/user.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");  
// const {reviewSchema} = require("../schema.js");
const reviewController = require("../controllers/review.js");


// write reviews page

// this code will not work if you dont use mergeParams , because Express Router, by default, does not merge the parameters of the parent route into the child route. Here parent route is listings... and child route is reviews.. if you dont merge it..then (let listing = await Listing.findById(req.params.id);)...in this line of code the id will be undefined 
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

// delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;