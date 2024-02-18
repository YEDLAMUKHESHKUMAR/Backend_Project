const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signUp.ejs");
}

module.exports.signUp =  async(req,res)=>{
    try{

        let {username,email,password} = req.body ;
        let newUser = new User({
            username,
            email,
            password
        })
        // no need to throw error... register will throw automatically..just write try and catch block
        // let userExist = await User.findOne({username:username});   
        // console.log(userExist);
        // if(userExist){
        //     req.flash("error","User already exists")
        //     res.redirect("/signUp");
        // }
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err) {
                return next(err);  
            }
            req.flash("success","welcome to wanderlust");  // stores the message in locals using middleware when triggered by redirect .
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signUp");
    }

}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{
    // passport automatically checks if user exists in database or not.. if not it wont even come inside the function , it will flash some message 
    req.flash("success","Successfully logged in");
    // res.redirect(req.session.redirectUrl); it doesn't work because by default passport clears the session once user was logged in
    let redirectUrl =  res.locals.redirectUrl || "/listings" ;   // if you directly tries to log in from home page...then isLoggedIn middleware would not be triggrred 
    res.redirect(redirectUrl);
    
}

module.exports.logOut = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","succesfully logged out !")
            res.redirect("/listings");
        }
    });
}