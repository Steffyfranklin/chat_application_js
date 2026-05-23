const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('chat message', (data) => {
    const messageWithTime = {
        username: data.username,
        msg: data.msg,
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    io.emit('chat message', messageWithTime)
})

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username)
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})