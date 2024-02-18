const express = require("express");
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();
const userController = require("../controllers/user.js");

router.get("/signup",userController.renderSignUpForm);

router.post("/signUp",userController.signUp);

router.get("/login",userController.renderLoginForm)

router.post("/login", 
    saveRedirectUrl,  // before authenticate , store originalUrl from where user came through
    passport.authenticate("local",
    {failureRedirect:'/login' , 
    failureFlash:true
    }), 
    userController.login)   


router.get("/logout",userController.logOut);

module.exports = router;