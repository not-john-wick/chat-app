const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const port = process.env.PORT;

const app = express();
app.set('view engine', 'jade');
// creating server outside the express library.
const server = http.createServer(app);
// creating a websocket server by passing the explicitly created serevr
const io = socketIO(server);

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

app.use('/', (req,res) => {
    res.render('index');
});

io.on('connection', (socket) => { // socket is an object which has information about new connections
    console.log('New Websocket connection');
    
    socket.emit('message', 'Welcome!'); // to send information to a single connection

    socket.broadcast.emit('message', 'A new user has joined');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('sendLocation', (location) => {
        io.emit('message', `https://www.google.com/maps?q=${location.latitude},${location.longitude}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left');
    });

});

server.listen(port, () => {
    console.log(`App is up on port ${port}`);
});