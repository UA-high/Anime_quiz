const mongoose = require('mongoose')
const config = require("../config/config")

async function connectDB(){

    try{
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to DB")
    }catch(err){
        console.log(err)
        throw new Error("Database connection error")
    }
}

module.exports = connectDB