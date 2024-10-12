const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

// Serve static files from the 'public' folder
app.use(express.static('public'));

io.on('connection', (socket) => {
    let username = '';

    socket.on('setUsername', (user) => {
        if (!Object.values(users).includes(user)) {
            username = user;
            users[socket.id] = username;
            socket.emit('valid', true);
            io.emit('userList', Object.values(users));
        } else {
            socket.emit('valid', false);
        }
    });

    socket.on('chatMessage', (msg) => {
        io.emit('message', { user: username, text: msg });
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('userList', Object.values(users));
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
