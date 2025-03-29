const express = require('express');
const meetingController = require('../controllers/meetingController');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


router.post('/createMeeting', authMiddleware, meetingController.createMeeting);
router.post('/webhook/zoom', meetingController.webhookzoom);
router.post('/createMeetingTest', meetingController.createMeetingTest);

module.exports = router;