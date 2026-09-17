const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { JWT_SECRET } = require("../config/config");

async function register(req, res) {
  // console.log(req.body)
  const { username, email, password, role = "user" } = req.body;

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
  )

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", refreshToken, cookieOptions);

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
  const { email, password } = req.body;

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

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", refreshToken, cookieOptions);

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

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    // Save the newly made refresh token in the cookies
    res.cookie("token", newRefreshToken, cookieOptions);

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
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = { register, login, logout, refreshedAccessToken };
