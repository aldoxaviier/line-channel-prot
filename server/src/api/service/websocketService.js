const { Server } = require('socket.io');
const messageService = require('./messageService');
let io;
let socketid;

const startChat = async(server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN
        }
    });

    io.on('connection', socket => {
        console.log(`New client connected: ${socket.id}`);
        socketid = socket.id;
        socket.on('send-message', async (body)=>{
            const {message,selectedUserId} = body;
            messageService.handleEvents(message, selectedUserId);
        })
    });
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

const getSocketid = () => {
    if (!socketid) {
        throw new Error('No socket connection available!');
    }
    return socketid;
}


module.exports = {startChat,getIO,getSocketid};