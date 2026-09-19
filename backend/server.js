const app = require("./src/app")
const connectDB = require("./src/db/db")
const { createServer } = require("http")
const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("./src/config/config")
const userModel = require("./src/models/user.model")
const { registerQuizSockets } = require("./src/socket/quizRooms")

const PORT = process.env.PORT || 3000
connectDB()

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: true, credentials: true } })

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await userModel.findById(decoded.id).select("username")
    if (!user) return next(new Error("Unauthorized"))
    socket.user = { id: user._id.toString(), username: user.username }
    next()
  } catch (_) {
    next(new Error("Unauthorized"))
  }
})
registerQuizSockets(io)

httpServer.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})
