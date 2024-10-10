const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let allLists = await Listing.find();
  // console.log(allLists,{allLists});
  res.render("listings/index.ejs", { allLists });
};

module.exports.newForm = (req, res) => {
  // write this above show route..
  console.log(req.user);

  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  // retreving the reviews of the listing , the authors for each and every review and also owner for the listing ,
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log("show route : ", list);
  if (!list) {
    // to prevent access for the deleted list
    req.flash("error", "The listing you requested for does not exist anymore");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  const newListing = new Listing(req.body.listing);
  // console.log("create listings ",req.user);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  console.log("data saved successfully");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    // to prevent access for the deleted list
    req.flash("error", "The listing you requested for does not exist anymore");
    res.redirect("/listings");
  }
  // console.log(list);
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { list, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); // to save photo
  }
  req.flash("success", " Listing edited successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing deleted successfully");
  console.log("deleted list is ", deletedList);
  res.redirect("/listings");
};
