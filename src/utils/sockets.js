const socketIO = require('socket.io');
const { models: { Message } } = require('../../models-mongoose');

const arrOrigins = [
    "http://localhost:3001",
    "https://siegfired-847bb.web.app",
    "https://siegfried.roomin.app",
    "http://localhost:3000"
];

var connectedUsers = {};

function createSockets(appServer) {

    const io = socketIO(appServer, {
        cors: {
            origin: arrOrigins,
            methods: ["GET", "POST"]
        }
    });


    io.on('connection', (socket) => {
        console.log('new connection', socket.id);
        socket.on('persist-user', user => {
            connectedUsers[socket.id] = user;
        });

        socket.on('disconnect', () => {
            console.log("disconnect", socket.id);
            delete connectedUsers[socket.id];
        });

        socket.on('persist-player', data => {
            socket.broadcast.emit('new-client', data)
        });

        socket.on('persist-position', data => {
        });
    });

    setInterval(() => {
        io.emit('connected-users', connectedUsers);
    }, 1000 * 1);
}

module.exports = {
    createSockets,
}