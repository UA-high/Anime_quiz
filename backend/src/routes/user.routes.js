const { Router } = require("express");
const { fetchDashboard } = require("../controllers/user.controller");

const router = Router();

router.get("/dashboard", fetchDashboard);

module.exports = router;
