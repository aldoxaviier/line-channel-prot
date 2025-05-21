const { customAlphabet } = require('nanoid');


const handleEvents = () => {
    const nanoid = customAlphabet('0123456789', 18);
    const id = nanoid();
    messageRepository.addMessage(id,userId,"out",message,"text");
    config.client.pushMessage("Ua01d445653d2669d792cf977188b6116",{
        type: 'text',
        text: message
    })
}

module.exports = {handleEvents};