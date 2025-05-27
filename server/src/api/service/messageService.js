const { customAlphabet } = require('nanoid');
const messageRepository = require('../repository/messageRepository');
const config = require('../../config/lineConfig');

const handleEvents = (message,userId) => {
    const nanoid = customAlphabet('0123456789', 18);
    const id = nanoid();
    messageRepository.addMessage(id,userId,"out",message,"text");
    config.client.pushMessage(userId,{
        type: 'text',
        text: message
    })
}

module.exports = {handleEvents};