const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    let newUser = new User({username,email});
    let registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if((err)=>{
            return next(err);
        })
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
   }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","You have successfully logged in to Wanderlust");
    // res.redirect("/listings");  If there is OU in res.locals.redirectUrl Rdct to it else /listngs
    let redirect = res.locals.redirectUrl || ("/listings");
    res.redirect(redirect);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully logged out");
        res.redirect("/listings");
    })
}