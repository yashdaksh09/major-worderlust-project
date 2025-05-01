const express = require("express");
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utlis/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl}= require("../middleware.js");
const userController= require("../controllers/users.js")

//Signup form Route
router.get("/signup",(userController.renderSignupForm));

// Signup registered route
router.post("/signup", wrapAsync(userController.signUp));

//Login form route

router.get("/login", (userController.renderLoginform));

router.post("/login", savedRedirectUrl, passport.authenticate("local", 
    {failureRedirect: "/login", failureFlash: true}), 
    userController.login
    );

//Log out Route

router.get("/logout", userController.logout)

module.exports=router;