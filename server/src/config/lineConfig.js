const line = require('@line/bot-sdk');
const accessToken = process.env.CHANNEL_ACCESS_TOKEN
const secret = process.env.CHANNEL_SECRET

// line config
const config = {
    channelAccessToken: accessToken,
    channelSecret: secret
}

// line client
const client = new line.Client(config);

module.exports = {config,client};