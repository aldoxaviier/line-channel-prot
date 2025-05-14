const lineconfig = require("../../config/lineConfig");
const fs = require('fs');
const path = require('path');
const ngrok = process.env.NGROK;
const cloudinary = require('cloudinary').v2;
const ffmpeg = require('fluent-ffmpeg');

const handleEvents = async (event) => {
    if (event.type !== 'message') {
        return null;
    }
    console.log(event);
    if(event.message.type === 'text'){
        return lineconfig.client.replyMessage(event.replyToken, [
            {
                "type": "text",
                "text": event.message.text
            }
        ]);
    }

    // cloudinary.config({
    //     cloud_name: process.env.CLOUD_NAME,
    //     api_key: process.env.CLOUD_API_KEY,
    //     api_secret: process.env.CLOUD_API_SECRET
    // });

    if(event.message.type === 'image'){
        const stream = await lineconfig.client.getMessageContent(event.message.id);
        const filePath = path.resolve(__dirname, '../../../public/images', `${event.message.id}.jpg`);
        const writable = fs.createWriteStream(filePath);
        stream.pipe(writable);

        await new Promise((resolve, reject) => {
            writable.on('finish', resolve);
            writable.on('error', reject);
        });

        return lineconfig.client.replyMessage(event.replyToken, [
            {
                type: 'image',
                originalContentUrl: `${ngrok}/images/${event.message.id}.jpg`,
                previewImageUrl: `${ngrok}/images/${event.message.id}.jpg`
            }
        ]);
    }

    if(event.message.type === 'video') {
        const stream = await lineconfig.client.getMessageContent(event.message.id);
        const videoPath = path.resolve(__dirname, '../../../public/videos', `${event.message.id}.mp4`);
        const filePath = path.resolve(__dirname, '../../../public/videos', `${event.message.id}.mp4`);
        const writable = fs.createWriteStream(filePath);
        stream.pipe(writable);
        
        // Wait until the file is saved before replying
        await new Promise((resolve, reject) => {
            writable.on('finish', resolve);
            writable.on('error', reject);
        });

        await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                count: 1,
                filename: `${event.message.id}_thumb.jpg`,
                folder: path.resolve(__dirname, '../../../public/images')
            })
            .on('end', resolve)
            .on('error', reject);
        });

        // const result = await cloudinary.uploader.upload(filePath, {
        //   resource_type: 'video',
        //   folder: 'line_uploads'
        // });

        // fs.unlinkSync(filePath);

        // return lineconfig.client.replyMessage(event.replyToken, {
        //   type: 'text',
        //   text: `Video uploaded to Cloudinary: ${result.secure_url}`
        // });
        
        return lineconfig.client.replyMessage(event.replyToken, [
            {
                type: 'video',
                originalContentUrl: `${ngrok}/videos/${event.message.id}.mp4`,
                previewImageUrl: `${ngrok}/images/${event.message.id}_thumb.jpg`
            }
        ]);
    }

    return null;
};

module.exports = {handleEvents}