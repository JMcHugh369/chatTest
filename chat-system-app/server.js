// filepath: server.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};

app.use(express.static(path.join(__dirname, 'src')));

io.on('connection', (socket) => {
  socket.on('register', (username) => {
    users[socket.id] = username;
    io.emit('user list', users);
  });

  socket.on('private message', ({ to, from, text }) => {
    socket.to(to).emit('private message', { from, text });
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // msg now contains { user, text }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user list', users);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});