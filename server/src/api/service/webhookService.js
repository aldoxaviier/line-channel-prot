const config = require("../../config/lineConfig");
const fs = require('fs');
const path = require('path');
const ngrok = process.env.NGROK;

const handleEvents = async (event) => {
    if (event.type !== 'message') {
        return null;
    }
    console.log(event);
    if(event.message.type === 'text'){
        return config.client.replyMessage(event.replyToken, [
            {
                "type": "text",
                "text": event.message.text
            }
        ]);
    }

    if(event.message.type === 'image'){
        const stream = await config.client.getMessageContent(event.message.id);
        const filePath = path.resolve(__dirname, '../../../public/images', `${event.message.id}.jpg`);
        const writable = fs.createWriteStream(filePath);
        stream.pipe(writable);
        
        // Wait until the file is saved before replying
        await new Promise((resolve, reject) => {
            writable.on('finish', resolve);
            writable.on('error', reject);
        });

        return config.client.replyMessage(event.replyToken, [
            {
                type: 'image',
                originalContentUrl: `${ngrok}/images/${event.message.id}.jpg`,
                previewImageUrl: `${ngrok}/images/${event.message.id}.jpg`
            }
        ]);
    }

    return null;
};

module.exports = {handleEvents}