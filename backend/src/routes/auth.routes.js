const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const route = Router();

route.post("/register", authController.register);
route.post("/login", authController.login);
route.post("/logout", authController.logout);
route.post("/refresh-token", authController.refreshedAccessToken);

module.exports = route;
