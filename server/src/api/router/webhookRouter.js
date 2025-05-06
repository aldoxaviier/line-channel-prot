const router = require("express").Router();
const line = require('@line/bot-sdk');
const controller = require("../controller/webhookController");
const config = require("../../config/lineConfig");

router.post("/", line.middleware(config.config),controller.receive)

module.exports = router;