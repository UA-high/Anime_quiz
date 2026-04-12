const mongoose = require("mongoose");

const mcq = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  desc: {
    type: String,
    required: [true, "Desc is required"],
  },
  ans: {
    type: String,
    required: [true, "Answer is required"],
  },
  opts: {
    type: [String],
    required: [true, "Options are required"],
  },
  image: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: [true, "Author name is required"],
  },
});

const mcqModel = mongoose.model("mcq", mcq);
module.exports = mcqModel;
