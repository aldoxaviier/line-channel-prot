const router = require("express").Router();
const controller = require("../controller/messageController");

router.post("/send-message",controller.send);

module.exports = router;