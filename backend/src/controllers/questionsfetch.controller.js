const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const mcqModel = require("../models/mcq.model");
const picqsModel = require("../models/picqs.model");

async function fetchMcq(req, res) {
  const { type, count } = req.body;

  const token = req.cookies.token;

  // const decoded = jwt.verify(token, JWT_SECRET);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  if (type === "mcq") {
    try {
      jwt.verify(token, JWT_SECRET);
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
      jwt.verify(token, JWT_SECRET);
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
