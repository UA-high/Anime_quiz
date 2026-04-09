const dotenv = require('dotenv')
dotenv.config()

//Checks
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not present in the environmental variables")
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not present in the environmental variables")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not present in the environmental variables")
}



const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY
}

module.exports = config
