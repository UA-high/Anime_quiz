const express = require("express");
const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const adminRoute = require("./routes/admin.routes")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== "production" && origin.startsWith("http://localhost:")) ||
      origin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/:user", userRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

module.exports = app;
