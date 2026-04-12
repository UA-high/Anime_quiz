const mcqModel = require("../models/mcq.model");
const picqsModel = require("../models/picqs.model");
const userModel = require("../models/user.model")

async function fetchQuiz(req, res) {
  const { type, count } = req.body;

  if (type === "mcq") {
    try {
      const n = Math.min(parseInt(count) || 10, 50);

      const questions = await mcqModel.aggregate([{ $sample: { size: n } }]);

      res.status(200).json({
        count: questions.length,
        questions,
        type: "mcq"
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
        type: "picq"
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

async function submitAnswer(req, res) {
  const { submissionArray, type } = req.body
  const userId = req.user.id
  let netScore = 0
  //example of submission array
  /*
    { questionId: "abc123", selectedAnswer: "Naruto" },
    { questionId: "def456", selectedAnswer: "Goku" },...
  */

  try {
    if (type === "mcq") {

      for (const key of submissionArray) {
        const id = key.questionId
        const answer = key.selectedAnswer

        const question = await mcqModel.findOne({
          _id: id
        })

        if (answer === question.ans) {
          netScore = netScore + 5;
        }
        else {
          netScore = netScore - 2;
        }
      }
    }
    else if (type === "picq") {
      for (const key of submissionArray) {

        const id = key.questionId
        const answer = key.selectedAnswer

        const question = await picqsModel.findOne({
          _id: id
        })

        if (answer === question.ans) {
          netScore = netScore + 5;
        }
        else {
          netScore = netScore - 2;
        }
      }
    }

    //Update the user score in database
    const updatedUser = await userModel.findByIdAndUpdate(userId, {
      $inc: { totalScore: netScore }
    }, { returnDocument: 'after' })

    res.status(200).json({
      Score: netScore,
      total: updatedUser.totalScore
    })

  } catch (err) {
    console.log(err)
    return res.status(401).json({
      messege: "Submission Error"
    })
  }
}

module.exports = { fetchQuiz, submitAnswer };
