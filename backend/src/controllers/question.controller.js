const mcq = require("../models/mcq.model")
const picqsModel = require("../models/picqs.model")
const jwt = require('jsonwebtoken')
const config = require("../config/config")
const uploadToCloud = require("../services/uploadImage.service")
const mcqModel = require("../models/mcq.model")


// Function to upload MCQs
async function uploadMcqQuestions(req, res){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            messege:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(
            token,
            config.JWT_SECRET
        )

        if(decoded.role !== 'admin'){
            return res.status(401).json({
                messege:"You are not allowed to upload questions"
            })
        }

        const {title, desc} = req.body
        
        let result = undefined

        if(req.file){
            const file = req.file
            //Upload the image to the image kit cloud
            result = await uploadToCloud(file.buffer)
        }

        //Upload the question to database
        const question = await mcqModel.create({
            title,
            desc,
            image: result.url
        })

        res.status(200).json({
            messege:"Question uploaded successfully",
            question
        })


    }catch(err){
        console.log(err)
        return res.status(401).json({
            messege:"Unauthorized",
        })
    }
}

// Upload picture questions
async function uploadPictureQuestions(req, res){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            messege:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(
            token,
            config.JWT_SECRET
        )

        if(decoded.role !== 'admin'){
            return res.status(401).json({
                messege:"You are not allowed to upload questions"
            })
        }

        const file = req.file

        //Need to pass the ans as an array of Strings from the fontend
        const {hints, ans} = req.body

        const result = await uploadToCloud(file.buffer)

        const question = await picqsModel.create({
            image:result.url,
            hints,
            ans
        })

        res.status(200).json({
            messege:"Questions is uploaded successfully",
            question
        })

    }catch(err){
        console.log(err)
        return res.status(401).json({
            messege:"Unauthorized"
        })
    }
}

module.exports = {uploadMcqQuestions, uploadPictureQuestions}