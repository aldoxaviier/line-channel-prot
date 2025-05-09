const config = require("../../config/lineConfig");
const fs = require('fs');
const path = require('path');
const openaiService = require('./openaiService');

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
        const ngrok = 'https://1ac4-36-71-71-91.ngrok-free.app';
        
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
const handleEventsOpenai = async (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return null;
    }
    console.log(event);
    const prompt = event.message.text;
    const text = await openaiService.generateText(prompt);
    return config.client.replyMessage(event.replyToken, [
        {
            "type": "text",
            "text": text
        }
    ]);
};
module.exports = {handleEvents, handleEventsOpenai}