const { Router } = require("express");
const { fetchDashboard } = require("../controllers/user.controller");
const { fetchQuiz, submitAnswer } = require("../controllers/questionsAction.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/dashboard", authUser, fetchDashboard);
router.get("/quiz", authUser, fetchQuiz);
router.post("/quiz/submit", authUser, submitAnswer)

module.exports = router;
