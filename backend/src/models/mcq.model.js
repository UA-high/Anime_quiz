const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    genres: {
      type: [String],
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return options.length === 4;
        },
        message: "A question must have exactly 4 options",
      },
    },

    hints: {
      type: [String],
      required: true,
      validate: {
        validator: function (hints) {
          return hints.length === 2;
        },
        message: "A question must have exactly 2 hints",
      },
    },

    explanation: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const mcqModel = mongoose.model("mcq", mcqSchema);
module.exports = mcqModel;
