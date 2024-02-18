const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        
    },
    // passport-local-mongoose will automatically created the username and hash-password fields
})

userSchema.plugin(passportLocalMongoose); // automatically creates username,hash-password,hashing,salting
// creating and exporting  model 
module.exports = mongoose.model("User",userSchema); 