const router = require("express").Router();
const controller = require("../controller/messageController");

router.post("/send-message",controller.send);
router.get("/get-message/:userId",controller.getAllMessage);

module.exports = router;