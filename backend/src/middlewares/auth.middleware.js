const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

// Base auth function to avoid redundancy
const verifyToken = (req, res) => {

  //Get the token from the req.headers 
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }

};

async function authAdmin(req, res, next) {
  const decoded = verifyToken(req, res);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (decoded.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden: Admin access required",
    });
  }

  req.user = decoded;
  next();
}

async function authUser(req, res, next) {
  const decoded = verifyToken(req, res);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Any valid role (user or admin) can access user routes
  req.user = decoded;
  next();
}

module.exports = { authAdmin, authUser };
