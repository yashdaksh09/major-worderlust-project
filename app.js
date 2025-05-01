if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dbUrl= process.env.ATLASDB_URL
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utlis/ExpressError.js");
const session= require("express-session");
const MongoStore= require("connect-mongo");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");


const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const store= MongoStore.create({ //  create a mongo store
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600, // interval session wil  be updated 
})

store.on("error", (err)=>{
    console.log("ERROR in MONGO  SESSION STOTRE", err);
})
// Using Session Cookies and defining the session options
const sessionOption= {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}




// MongoDB connection
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/view"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));



app.use(session(sessionOption));
app.use(flash());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());// serialize into the session
passport.deserializeUser(User.deserializeUser()); // deserialize user into the session



app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next()
})


// app.get("/demouser", async(req, res)=>{
//     let fakeUser= new User({
//         email: "yashdaksh620@gmail.com",
//         username: "naman"
//     })
//     let registeredUser= await User.register(fakeUser, "Yash@123");
//     res.send(registeredUser)

// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter)

app.all("*", (req, res, next)=>{
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message); // <-- This sends raw text
});


// Start the server
app.listen(8080, () => {
    console.log("Server listening on port 8080");
});
