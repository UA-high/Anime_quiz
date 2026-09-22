const app = require("./src/app");
const connectDB = require("./src/db/db");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./src/config/config");
const userModel = require("./src/models/user.model");
const { registerQuizSockets } = require("./src/socket/quizRooms");
// const { generateQuestion } = require("./src/services/ai.service");

const PORT = process.env.PORT || 3000;
connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: true, credentials: true },
});

io.use(async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;
    let decoded = null;

    if (token) {
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (_) {
        decoded = null;
      }
    }

    // Fallback to refresh token cookie if access token is missing or expired
    if (!decoded && socket.handshake.headers?.cookie) {
      const cookies = socket.handshake.headers.cookie.split(";").reduce((acc, pair) => {
        const [key, ...rest] = pair.trim().split("=");
        if (key) acc[key] = decodeURIComponent(rest.join("="));
        return acc;
      }, {});

      if (cookies.token) {
        try {
          decoded = jwt.verify(cookies.token, JWT_SECRET);
        } catch (_) {
          decoded = null;
        }
      }
    }

    if (!decoded?.id) return next(new Error("Unauthorized"));

    const user = await userModel.findById(decoded.id).select("username");
    if (!user) return next(new Error("Unauthorized"));
    socket.user = { id: user._id.toString(), username: user.username };
    next();
  } catch (_) {
    next(new Error("Unauthorized"));
  }
});
registerQuizSockets(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// generateQuestion();
