const router = require('express').Router();
const controller = require('../controller/userController');

router.get('/get-all-user', controller.getAllUsers);

module.exports = router;