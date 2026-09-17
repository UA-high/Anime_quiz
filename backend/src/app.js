const express = require("express");
const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const adminRoute = require("./routes/admin.routes")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/:user", userRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

module.exports = app;
