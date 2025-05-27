const config = require("../../config/lineConfig");
const messageRepository = require("../repository/messageRepository");   
const messageService = require("../service/messageService");

const send = async(req,res) => {
    try {
        const {message,selectedUserId} = req.body;
        messageService.handleEvents(message, selectedUserId)
        res.json("berhasil");
    } catch (err) {
        console.error(err.message);
    }
}

const getAllMessage = async (req,res) => {
    try {
        const {userId} = req.params;
        const message = await messageRepository.getAllMessage(userId);
        res.json(message);
    } catch (err) {
        console.error(err.message);
    }
}

const getLastMessage = async (req,res) => {
    try {
        const {userId} = req.params;
        const message = await messageRepository.getLastMessage(userId);
        res.json(message);
    } catch (error) {
        console.error(error.message);
    }
}

const readStatus = async (req,res) => {
    try {
        const {messageId} = req.params;
        const message = await messageRepository.readStatus(messageId);
        res.json(message);
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {send,getAllMessage,getLastMessage,readStatus}