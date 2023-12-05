const express = require("express");
const router = express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const { RedirectdSavedUrl } = require("../middleware.js");
const userControllers = require("../controllers/users.js");

router.route("/signup")
.get(userControllers.renderSignupForm)
.post(userControllers.signUp);

router.route("/login")
.get(userControllers.renderLoginForm)
.post(RedirectdSavedUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.login);


// router.get("/signup",userControllers.renderSignupForm);

// router.post("/signup",userControllers.signUp);

// router.get("/login",userControllers.renderLoginForm);

// router.post("/login",RedirectdSavedUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.login)

router.get("/logout",userControllers.logout);

module.exports=router;

