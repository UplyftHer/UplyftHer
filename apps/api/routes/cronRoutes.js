const express = require('express');
const cronController = require('../controllers/cronController');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


router.get('/beforeMeetingNotification', cronController.beforeMeetingNotification);

module.exports = router;