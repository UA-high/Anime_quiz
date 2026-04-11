const { Router } = require("express");
const { fetchDashboard } = require("../controllers/user.controller");
const { fetchMcq } = require("../controllers/questionsfetch.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/dashboard", authUser, fetchDashboard);
router.get("/quiz", authUser, fetchMcq);
module.exports = router;
