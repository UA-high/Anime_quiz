const { JWT_SECRET } = require("../config/config");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function fetchDashboard(req, res) {
  const decoded = jwt.verify(req.cookies.token, JWT_SECRET);

  const user = await userModel.findOne({
    _id: decoded.id,
  });

  res.status(200).json({
    user,
  });
}

module.exports = { fetchDashboard };
