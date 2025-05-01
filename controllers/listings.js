const Listing= require("../models/listings");
const mbxGeocoding= require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({accessToken: mapToken}) 


module.exports.index=(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  });

  module.exports.renderNewForm= (req, res) => {
    if(!req.isAuthenticated()){
      req.flash("error","You must be logged in to create a new listing");
      return res.redirect("/login");
    }
    res.render("listings/new.ejs");
  }

  module.exports.showListing=(async (req, res) => {
      let { id } = req.params;
     
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");// Populate owner
      if (!listing) {
        req.flash("error", "Listing does not exits");
        res.redirect("/listings");
      }
  
      res.render("listings/show", { listing });
    })

    module.exports.createListing=(async (req, res, next) => {

      let response= await geocodingClient 
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

        let url= req.file.path;
        let filename= req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner= req.user._id;
        newListing.image= {url, filename}
        newListing.geometry=response.body.features[0].geometry;
        newListing.category= req.body.listing.category;
        console.log(newListing);
        let savedListing= await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing Created Successfully")
    
        res.redirect("/listings"); 
      })

module.exports.renderEditform=(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing does not exits");
      res.redirect("/listings");
    }
    let originalImageurl= listing.image.url;
    originalImageurl=originalImageurl.replace("/upload","/upload/,w_250") // cloudinary paramater change picture pixel
    res.render("listings/edit.ejs", { listing, originalImageurl });
  })

  module.exports.updateListing=(async (req, res) => {
  let id = req.params.id;
  let listing= await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
  if(typeof req.file!=="undefined"){
  let url= req.file.path;
  let filename= req.file.filename;
    listing.image= {url, filename};
    await listing.save();
  }
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`);
  });

  module.exports.deleteListing=(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("error", "Listing Deleted Successfully")
    res.redirect("/listings");
  })