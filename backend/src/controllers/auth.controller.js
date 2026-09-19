const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { JWT_SECRET } = require("../config/config");

// A secure cookie cannot be stored by an HTTP localhost frontend. Use HTTPS
// detection as the source of truth so a production-mode backend can still be
// tested locally with FRONTEND_URL=http://localhost:5173.
const isSecureFrontend = process.env.NODE_ENV === "production" &&
  String(process.env.FRONTEND_URL || "").startsWith("https://");

// In production (Render backend + Vercel frontend), cross-site cookies require sameSite: "none" and secure: true.
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isSecureFrontend,
  sameSite: isSecureFrontend ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: isSecureFrontend,
  sameSite: isSecureFrontend ? "none" : "lax",
});

async function register(req, res) {
  // console.log(req.body)
  const username = String(req.body.username || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  const isUserAlreadyPresent = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyPresent)
    return res.status(401).json({
      message: "User Already Exists",
    });

  const hashed = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashed,
    role,
  });

  //Generate an access token (saving it only to the memory)
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  //Generate a refreshToken and save it to the cookie storage
  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  res.cookie("token", refreshToken, getCookieOptions());

  return res.status(200).json({
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: accessToken,
  });
}

async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(401).json({
      message: "User does not exist",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", refreshToken, getCookieOptions());

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      totalScore: user.totalScore,
    },
    token: accessToken,
  });
}

async function refreshedAccessToken(req, res) {
  const refreshToken = req.cookies?.token;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Forbidden: No refresh token provided",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Generate a new access token using the decoded id and role from refresh token
    const accessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // For security purposes generate a new refreshToken as well
    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Save the newly made refresh token in the cookies
    res.cookie("token", newRefreshToken, getCookieOptions());

    const user = await userModel.findById(decoded.id).select("-password");

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
      user,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
}

async function logout(req, res) {
  res.clearCookie("token", getClearCookieOptions());
  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = { register, login, logout, refreshedAccessToken };
