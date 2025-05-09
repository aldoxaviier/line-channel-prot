const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();
const PORT = process.env.PORT;
const path = require('path');

const app = express();

app.use("/webhook",require("./src/api/router/webhookRouter"));

app.use(express.json());

app.use("/message",require("./src/api/router/messageRouter"));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// const config = {
//     channelAccessToken: accessToken,
//     channelSecret: secret
// }

// app.post('/webhook', line.middleware(config),(req,res)=>{
//     Promise
//         .all([
//             req.body.events.map(handleEvents)
//         ])
//         .then((result) => res.json(result))
// });

// const client = new line.Client(config);

// const handleEvents = (event) => {
//     if(event.type !== 'message' || event.message.type !== 'text'){
//         return Promise.resolve(null);
//     }
//     console.log(event);
//     return client.replyMessage(event.replyToken,[
//         {
//             "type": "text",
//             "text": `${event.message.text}`
//         }
//     ])
// }

app.listen(PORT, () => {
console.log(`Server running at ${PORT}`);
});