const picqsModel = require("../models/picqs.model");
const uploadToCloud = require("../services/uploadImage.service");
const mcqModel = require("../models/mcq.model");

// Function to upload MCQs
async function uploadMcqQuestions(req, res) {
  const { title, desc, opts } = req.body;

  let result = undefined;

  if (req.file) {
    const file = req.file;
    //Upload the image to the image kit cloud
    result = await uploadToCloud(file.buffer);
  }

  //Upload the question to database
  const question = await mcqModel.create({
    title,
    desc,
    opts,
    image: result ? result.url : "",
  });

  res.status(200).json({
    messege: "Question uploaded successfully",
    question,
  });
}

// Upload picture questions
async function uploadPictureQuestions(req, res) {
  const file = req.file;

  //Need to pass the ans as an array of Strings from the fontend
  const { hints, ans } = req.body;

  const result = await uploadToCloud(file.buffer);

  const question = await picqsModel.create({
    image: result.url,
    hints,
    ans,
  });

  res.status(200).json({
    messege: "Questions is uploaded successfully",
    question,
  });
}

module.exports = { uploadMcqQuestions, uploadPictureQuestions };
