const { Server } = require('socket.io');
const messageService = require('./messageService');
const messageRepository = require('../repository/messageRepository');
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
        socket.on('read-messages', (userId) =>{
            messageRepository.updateRead(userId);
        });
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