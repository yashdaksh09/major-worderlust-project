const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listings.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/wonderlust";


main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner: "67dfe7bd98ae25705baddc66"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();