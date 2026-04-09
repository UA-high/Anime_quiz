const express = require("express");
const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const adminRoute = require("./routes/admin.routes")
const cookieParser = require("cookie-parser");
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/:user", userRoute);
app.use("/api/admin", adminRoute)

module.exports = app;
