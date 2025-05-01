const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./review.js");
const { listingSchema } = require("../view/schema");
const { required } = require("joi");

const listingsSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
       filename: String,
       url: String,         
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",

        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type:{
            type: String,  // Don't do {location: {type: String}}
            enum: ["Point"], //location.type must be "Point"
            required: true,
        },
        coordinates:{
            type:[Number],
            required: true,
        }
    },
    category:{
        type: String,
        enum: ["mountain", "pools", "rooms", "farms", "iconnic cities"]

    }
});

listingsSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})
const Listing= mongoose.model("Listing",listingsSchema);
module.exports= Listing;