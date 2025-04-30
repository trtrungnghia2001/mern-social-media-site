import { Server } from 'socket.io'
import { createServer } from 'http'
import express from 'express'
import ENV_CONFIG from './env.config.js'

const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: [ENV_CONFIG.URL_WEBSITE],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
  },
})

// used to store online users
export const userSocketMap = {} // {userId: socketId}
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]
}

io.on('connection', function (socket) {
  console.log('a user connected::' + socket.id)

  const userId = socket.handshake.query.userId
  if (userId) userSocketMap[userId] = socket.id

  // io.emit() is used to send events to all the connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id)
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, server, app }
