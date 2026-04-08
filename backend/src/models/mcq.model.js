const mongoose = require('mongoose')

const mcq = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
})

const mcqModel = mongoose.model("quiz/mcq", mcq)
module.exports = mcqModel

