const express = require("express");
const router  = express.Router(); 
const wrapAsync =  require("../utility/wrapAsync.js");
// const ExpressError = require("../utility/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { valid } = require("joi");
// authentication
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");


const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
// const upload = multer({dest:'uploads/'});
const upload = multer({storage});




// index route 

router.get("/",wrapAsync(listingController.index));


// newForm
router.get("/new",isLoggedIn,listingController.newForm);

// create new listing

router.post("/",isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
// router.post("/",,(req,res)=>{
//     res.send(req.file);
// })
// show route
router.get("/:id", wrapAsync(listingController.showListings));

// get edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));

// update route 

router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;