const User= require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup")
}


module.exports.signUp=(async(req, res)=>{
    try{
        let {email, username, password}= req.body;
    const newUser= new User({email, username});
    const registredUser= await User.register(newUser, password);
    console.log(registredUser);
    req.login(registredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wonderlust");
    res.redirect("/listings");
    })
    
    } catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    }
});
module.exports.renderLoginform=(req, res)=>{
    res.render("users/login")
}


module.exports.login=async(req,res)=>{
    req.flash("success", "Welcome back to wonderlust!")
    let redirectUrl= res.locals.redirectUrl || "/listings"; // check flow iforginal url not saved
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Logout Successfully");
        res.redirect("/listings");
    })
}