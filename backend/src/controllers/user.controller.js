const { JWT_SECRET } = require("../config/config");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function fetchDashboard(req, res) {
  const user = await userModel.findOne({
    _id: req.user.id,
  });

  res.status(200).json({
    user,
  });
}

module.exports = { fetchDashboard };
