const config = require("../../config/lineConfig");
const messageRepository = require("../repository/messageRepository");   
const messageService = require("../service/messageService");

const send = async(req,res) => {
    try {
        const {message,userId} = req.body;
        messageService.handleEvents(message, userId)
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

module.exports = {send,getAllMessage}