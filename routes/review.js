const express = require("express");
const router = express.Router({mergeParams:true}); //To use the parent object with child ["/listings/:id/reviews":parent ,/:child] else it will print undefined our (id)can't be accessed.
const wrapAsync = require("../utils/wrapAsync.js"); //cont.. to use outside app.js{mergeParams:true to merger id with child docs}
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{isLoggedIn,isReviewAuthor} = require("../middleware.js");

const validateReview = (req,res,next)=>{ //Throw error
    let {error}=reviewSchema.validate(req.body);
    if(error){
        // Optional : To get the error details.
        let errMsg = error.details.map((el)=>el.message).join(","); 
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}; 

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post review route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;