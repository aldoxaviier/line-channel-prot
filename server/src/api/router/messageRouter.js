const router = require("express").Router();
const controller = require("../controller/messageController");

router.post("/send-message",controller.send);
router.get("/get-message/:userId",controller.getAllMessage);
router.get("/get-last-message/:userId",controller.getLastMessage);
router.put("/read-status/:messageId",controller.readStatus);

module.exports = router;