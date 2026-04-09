const {Router} = require('express')
const multer = require('multer')
const {uploadMcqQuestions, uploadPictureQuestions} = require("../controllers/question.controller")

const route = Router()

const upload = multer({
    storage: multer.memoryStorage()
})

route.post("/upload/mcq", upload.single("image"),uploadMcqQuestions)
route.post("/upload/picqs", upload.single("image"), uploadPictureQuestions)

module.exports = route