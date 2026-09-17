const picqsModel = require("../models/picqs.model");
const uploadToCloud = require("../services/uploadImage.service");
const mcqModel = require("../models/mcq.model");

// Function to upload MCQs
async function uploadMcqQuestions(req, res) {
  try {
    const { title, desc, opts, ans } = req.body;

    let parsedOpts = opts;
    if (typeof opts === "string") {
      try {
        parsedOpts = JSON.parse(opts);
      } catch (e) {
        parsedOpts = opts.split(",").map((s) => s.trim());
      }
    }

    let result = undefined;
    if (req.file) {
      const file = req.file;
      result = await uploadToCloud(file.buffer);
    }

    const question = await mcqModel.create({
      title,
      desc,
      ans,
      opts: parsedOpts,
      image: result ? result.url : (req.body.image || ""),
      author: req.user.id,
    });

    res.status(200).json({
      message: "Question uploaded successfully",
      question,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload MCQ question", error: err.message });
  }
}

// Upload picture questions
async function uploadPictureQuestions(req, res) {
  try {
    const { hints, ans } = req.body;

    let parsedHints = hints;
    if (typeof hints === "string") {
      try {
        parsedHints = JSON.parse(hints);
      } catch (e) {
        parsedHints = hints.split(",").map((s) => s.trim());
      }
    }

    let imageUrl = req.body.image || "";
    if (req.file) {
      const file = req.file;
      const result = await uploadToCloud(file.buffer);
      imageUrl = result.url;
    }

    const question = await picqsModel.create({
      image: imageUrl,
      hints: parsedHints,
      ans,
      author: req.user.id,
    });

    res.status(200).json({
      message: "Question uploaded successfully",
      question,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload picture question", error: err.message });
  }
}

module.exports = { uploadMcqQuestions, uploadPictureQuestions };
