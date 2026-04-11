const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const mcqModel = require("../models/mcq.model");
const picqsModel = require("../models/picqs.model");

async function fetchMcq(req, res) {
  const { type, count } = req.body;

  if (type === "mcq") {
    try {
      const n = Math.min(parseInt(count) || 10, 50);

      const questions = await mcqModel.aggregate([{ $sample: { size: n } }]);

      res.status(200).json({
        count: questions.length,
        questions,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  } else if (type === "picq") {
    try {
      const n = Math.min(parseInt(count) || 10, 50);

      const questions = await picqsModel.aggregate([{ $sample: { size: n } }]);

      res.status(200).json({
        count: questions.length,
        questions,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = { fetchMcq };
