const dotenv = require('dotenv')
dotenv.config()

//Checks
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not found")
}
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not present in the environmental variables")
}



const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

module.exports = config
