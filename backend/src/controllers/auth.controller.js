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

  res.cookie("token", refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json({
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token:accessToken
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
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  )

  res.cookie("token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token:accessToken
  });
}

async function refreshedAccessToken(req, res) {
  const refreshToken = req.cookie.token
  if(!refreshToken){
    return res.status(401).json({
      messege:"Forbidden"
    })
  }

  const decoded = jwt.verify(
    refreshToken,
    JWT_SECRET
  )

  //Generate a new access token using the decoded id and role from refresh token
  const accessToken = jwt.sign(
    {
      id:decoded.id,
      role:decoded.role
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  )

  //For security purposes generate a new refreshToken as well
  const newRefreshToken = jwt.sign(
    {
      id:decoded.id,
      role:decoded.role
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  )

  //Save the newly made refresh token in the cookies
  res.cookie("token", newRefreshToken, {
    httpOnly:true,
    secure:true,
    sameSite:"secure",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({
    messege:"Access token refreshed successfully",
    accessToken
  })
}

async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = { register, login, logout, refreshedAccessToken };
