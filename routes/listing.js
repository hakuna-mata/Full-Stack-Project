const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const{isLoggedIn,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const{storage}=require("../cloudConfig.js")
const upload = multer({storage});


const validateListing = (req,res,next)=>{ //Throw error
    let {error}=listingSchema.validate(req.body);
    if(error){
        // Optional : To get the error details.
        let errMsg = error.details.map((el)=>el.message).join(","); 
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}  

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing)); //midlleware u.s("")

//New route   This route is placed first because if it is placed after /lst/:id - it will consider /new as id in (/listings/new) and search for that id in db
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//Index route
// router.get("/",wrapAsync(listingController.index));
  
//Show route
//   router.get("/:id",wrapAsync(listingController.showListing));
  
  //Create route
//   router.post("/",isLoggedIn,wrapAsync(listingController.createListing));
  
  //Edit route
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
  
  //Update route
//   router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
  
  //Delete route
//   router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

  module.exports=router;