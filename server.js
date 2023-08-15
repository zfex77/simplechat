const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve the static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('new user', (username) => {
    socket.username = username;
    io.emit('chat message', `${username} has joined the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.username}: ${msg}`);
  });

  socket.on('disconnect', () => {
    io.emit('chat message', `${socket.username} has left the chat`);
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
