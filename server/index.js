const path = require('path')
const cors = require('cors');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {randRoom, randPiece} = require('./utilities/utils')
const Player = require('./utilities/player')
const Board = require('./utilities/board')

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')))

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});
const rooms = new Map();
const makeRoom = (resolve) =>{
    var newRoomId = randRoom()
    while (rooms.has(newRoomId)) {
        newRoomId = randRoom()
    }
    rooms.set(newRoomId, { roomId: newRoomId, players: [], board: null })
    resolve(newRoomId)
}
const joinRoom = (player, room) => {
    currentRoom = rooms.get(room);
    updatedPlayerList = currentRoom.players.push(player)
    updatedRoom = { ...currentRoom, players: updatedPlayerList }
}
function getRoomPlayersNum(room) {
    return rooms.get(room).players.length
}
function pieceAssignment(room) {
    const firstPiece = randPiece()
    const lastPiece = firstPiece === 'X' ? 'O' : 'X'

    currentRoom = rooms.get(room)
    currentRoom.players[0].piece = firstPiece
    currentRoom.players[1].piece = lastPiece
}
function newGame(room) {
    currentRoom = rooms.get(room)
    const board = new Board
    currentRoom.board = board
}
function kick(room) {
    currentRoom = rooms.get(room)
    currentRoom.players.pop()
}

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
        console.log('newRoomJoin event received !', room);
        
        if (room === '' || name === '') {
            io.to(socket.id).emit('joinError')
        }

        socket.join(room)
        const id = socket.id
        const newPlayer = new Player(name, room, id)
        joinRoom(newPlayer, room)

        const peopleInRoom = getRoomPlayersNum(room)

        if (peopleInRoom === 1) {
            io.to(room).emit('waiting')
        }

        if (peopleInRoom === 2) {
            pieceAssignment(room)
            currentPlayers = rooms.get(room).players
            for (const player of currentPlayers) {
                io.to(player.id).emit('pieceAssignment', { piece: player.piece, id: player.id })
            }
            newGame(room)

            const currentRoom = rooms.get(room)
            const gameState = currentRoom.board.game
            const turn = currentRoom.board.turn
            const players = currentRoom.players.map((player) => [player.id, player.name])
            io.to(room).emit('starting', { gameState, players, turn })
        }

        if (peopleInRoom === 3) {
            socket.leave(room)
            kick(room)
            io.to(socket.id).emit('joinError')
        }
    })

    socket.on('move', ({ room, piece, index }) => {
        currentBoard = rooms.get(room).board
        currentBoard.move(index, piece)

        if (currentBoard.checkWinner(piece)) {
            io.to(room).emit('winner', { gameState: currentBoard.game, id: socket.id })
        } else if (currentBoard.checkDraw()) {
            io.to(room).emit('draw', { gameState: currentBoard.game })
        } else {
            currentBoard.switchTurn();
            io.to(room).emit('update', { gameState: currentBoard.game, turn: currentBoard.turn })
        }
    })

    socket.on('playAgainRequest', (room) => {
        console.log('playAgainRequest event received !');
        console.log('playAgainRequest event received !');
        currentRoom = rooms.get(room)
        currentRoom.board.reset()
        pieceAssignment(room)
        currentPlayers = currentRoom.players
        for (const player of currentPlayers) {
            io.to(player).emit('pieceAssignment')
        }
        io.to(room).emit('restart', { gameState: currentRoom.board.game, turn: currentRoom.board.turn })
    })

    socket.on('disconnecting', () => {
        console.log('disconnecting event received !');
        return;
    })
    socket.on('newGame', () => {
        new Promise(makeRoom).then((room) => {
            socket.emit('newGameCreated', room)
        })
    });
    socket.on('joining', ({room}) => {
        if (rooms.has(room)){
            socket.emit('joinConfirmed')
        }else{
            socket.emit('errorMessage', 'No room with that id found')
        }
    });
})


server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
