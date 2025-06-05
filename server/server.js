const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();
const PORT = process.env.PORT;
const path = require('path');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const wsservice = require("./src/api/service/websocketService");

app.use("/webhook",require("./src/api/router/webhookRouter"));

app.use(cors());
app.use(express.json());


app.use("/message",require("./src/api/router/messageRouter"));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));
app.use('/user', require("./src/api/router/userRouter"));

wsservice.startChat(server);

server.listen(PORT, () => {
console.log(`Server running at ${PORT}`);
});