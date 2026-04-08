const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const userModel = require("../models/user.model");
const { JWT_SECRET } = require('../config/config');


async function register(req, res) {
    // console.log(req.body)
    const { username, email, password, role = 'user' } = req.body

    const isUserAlreadyPresent = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyPresent)
        return res.status(401).json({
            "message": "User Already Exists"
        })

    const hashed = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashed,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, JWT_SECRET, {
        expiresIn: '1d'
    })

    res.cookie("token", token)

    return res.status(200).json({
        "message": "User created successfully",
        "user": {
            "id": user._id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    })
}

async function login(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(401).json({
            "message": "User does not exist"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({ "message": "Invalid credentials" })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, JWT_SECRET, {
        expiresIn: '1d'
    })

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        "user": {
            "id": user._id,
            "username": user.username
        }
    })
}


async function logout(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        "message": "User logged out successfully"
    })
}

module.exports = { register, login, logout }
