const mongoose = require("mongoose");

const picqsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  hints: {
    type: [String],
    required: true,
  },
  ans: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: [true, "Author name is required"],
  },
});

const picqsModel = mongoose.model("picqs", picqsSchema);

module.exports = picqsModel;

