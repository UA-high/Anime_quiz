const { Router } = require("express");
const { fetchDashboard } = require("../controllers/user.controller");
const { fetchMcq } = require("../controllers/questionsfetch.controller");

const router = Router();

router.get("/dashboard", fetchDashboard);
router.get("/quiz", fetchMcq);
module.exports = router;
