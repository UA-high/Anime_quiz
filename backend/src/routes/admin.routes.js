const { Router } = require("express");
const multer = require("multer");
const {
  uploadMcqQuestions,
  uploadPictureQuestions,
} = require("../controllers/question.controller");
const { authAdmin } = require("../middlewares/auth.middleware");

const route = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

route.post(
  "/upload/mcq",
  authAdmin,
  upload.single("image"),
  uploadMcqQuestions,
);
route.post(
  "/upload/picqs",
  authAdmin,
  upload.single("image"),
  uploadPictureQuestions,
);

module.exports = route;

