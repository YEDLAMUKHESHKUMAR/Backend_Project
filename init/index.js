const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing  = require("../models/listing.js");


const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("connnected to db");
})
.catch(()=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async () =>{
    // delete all listings from the database
    await Listing.deleteMany({});   
    initData.data = initData.data.map((obj)=>({...obj , owner:"65a0119d3984b2d22d2c67d1"}))
    await Listing.insertMany(initData.data);
    console.log("data saved");
}

initDB(); 
