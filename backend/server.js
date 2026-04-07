const app = require("./src/app")
const connectDB = require("./src/db/db")

const PORT = 3000
connectDB()

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})