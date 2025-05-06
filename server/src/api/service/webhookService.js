const config = require("../../config/lineConfig");

const handleEvents = async (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return null;
    }
    console.log(event);
    return config.client.replyMessage(event.replyToken, [
        {
            "type": "text",
            "text": event.message.text
        }
    ]);
};

module.exports = {handleEvents}