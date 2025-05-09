const router = require('express').Router();
const controller = require('../controller/openaiController');

router.post('/generate', controller.generateText);

module.exports = router;
