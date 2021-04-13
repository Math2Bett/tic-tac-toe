const cors = require('cors');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', socket => {
    socket.on('newGame', () => {
        console.log('newGame event received !');
        return;
    })

    socket.on('joining', ({ room }) => {
        console.log('joining event received !');
        return;
    })

    socket.on('newRoomJoin', ({ room, name }) => {
        console.log('newRoomJoin event received !');
        return;
    })

    socket.on('move', ({ room, piece, index }) => {
        console.log('move event received !');
        return;
    })

    socket.on('playAgainRequest', (room) => {
        console.log('playAgainRequest event received !');
        return;
    })

    socket.on('disconnecting', () => {
        console.log('disconnecting event received !');
        return;
    })
})


server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
