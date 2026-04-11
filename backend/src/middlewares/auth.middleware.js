const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

async function authAdmin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to perform this action",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin" && decoded.role !== "user") {
      return res.status(403).json({
        message: "You are not allowed to perform this action",
      });
    }
    req.user = decoded;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = { authAdmin, authUser };
