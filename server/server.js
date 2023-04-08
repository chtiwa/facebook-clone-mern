require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.CLIENT_URL
  }
})
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const connectDB = require('./db/connect')
const authentication = require('./middleware/authentication')
const authRoutes = require('./routes/auth')
const postsRoutes = require('./routes/posts')
const usersRoutes = require('./routes/users')
const storiesRoutes = require('./routes/stories')
const conversationsRoutes = require('./routes/conversations')
const messagesRoutes = require('./routes/messages')
const errorHandler = require('./middleware/error-handler')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// security
app.use(xss())
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
}))
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
      "media-src": ["'self'", "https: data:"]
    }
  })
)

app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/posts', authentication, postsRoutes)
app.use('/api/v1/users', authentication, usersRoutes)
app.use('/api/v1/stories', authentication, storiesRoutes)
app.use('/api/v1/conversations', authentication, conversationsRoutes)
app.use('/api/v1/messages', authentication, messagesRoutes)

app.use(errorHandler)

// socket.io
// seperate folder for socket.io ?
// io is for emitting an event to the client
// socket is for receiving an event from the client
let users = []
const addUser = (userId, socketId) => {
  if (users.some(user => user.userId === userId)) return
  users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId)
}

io.on('connection', (socket) => {
  // console.log('A user connected')
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id)
    io.emit("getUsers", users)
  })

  // send and get messages
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // senderId is the userId
    const user = getUser(receiverId)
    // send the message to the dedicated user
    // when sending the messages in the client they will be saved in the database
    // console.log(user)
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text
    })
  })

  // take userId and socketId from user
  socket.on('disconnect', () => {
    // console.log('A user disconnected')
    removeUser(socket.id)
    io.emit("getUsers", users)
  })
})


const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    http.listen(port, console.log(`Server is listening on port : ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()