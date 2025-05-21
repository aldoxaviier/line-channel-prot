const lineconfig = require("../../config/lineConfig");
const fs = require('fs');
const path = require('path');
const ngrok = process.env.NGROK;
const local = process.env.LOCAL;
const cloudinary = require('cloudinary').v2;
const ffmpeg = require('fluent-ffmpeg');
const messageRepository = require('../repository/messageRepository');
const userRepository = require('../repository/userRepository');

const handleEvents = async (event) => {
    const direction = "in";
    if (event.type !== 'message') {
        return null;
    }
    console.log(event);
    const userprofile = await getUserProfile(event.source.userId);
    const check = await checkId(userprofile.userId);
    if (!check) {
        await userRepository.addUser(userprofile.userId, userprofile.displayName, userprofile.pictureUrl);
    }    
    if(event.message.type === 'text'){
        // Save message to database first
        await messageRepository.addMessage(event.message.id, event.source.userId, direction, event.message.text, event.message.type);
        // Then reply with the same message
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
        
        const pictureurl = `images/${event.message.id}.jpg`;
        await messageRepository.addMessage(event.message.id, event.source.userId, direction, pictureurl,event.message.type);

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

        const videourl = `videos/${event.message.id}.mp4`;
        await messageRepository.addMessage(event.message.id, event.source.userId, direction, videourl,event.message.type);

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

    const getUserProfile = async (userId) => {
        try {
            const user = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${lineconfig.config.channelAccessToken}`
                }
            });
            const userProfile = await user.json();
            return userProfile;
        } catch (err) {
            console.error(err.message);
        }
    }

    const checkId = async (userId) => {
        const user = await userRepository.getUserById(userId);
        if (user) {
            return true;
        } else {
            return false;
        }
    }

module.exports = {handleEvents}