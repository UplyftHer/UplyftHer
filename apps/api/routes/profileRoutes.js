const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

// test apis 
router.post('/testUserDelete', profileController.testUserDelete);
router.post('/deleteConnectedUsers', profileController.deleteConnectedUsers);
// for dashboard
router.post('/getInterests', profileController.getInterests);
router.post('/getIndustries', profileController.getIndustries);

router.post('/logout', profileController.logout);
router.post('/deleteUser', authMiddleware, profileController.deleteUser);
router.post('/blockUser', authMiddleware, profileController.blockUser);
router.post('/getBlockedUsers', authMiddleware, profileController.getBlockedUsers);
router.post('/editProfile', authMiddleware, profileController.editProfile);
router.post('/editEmail', authMiddleware, profileController.editEmail);
router.post('/confirmNewEmail', authMiddleware, profileController.confirmNewEmail);
router.post('/getProfile', authMiddleware, profileController.getProfile);
router.post('/changePassword', authMiddleware, profileController.changePassword);
router.post('/availibiltyNewMatches', authMiddleware, profileController.availibiltyNewMatches);
router.post('/communicationPreferences', authMiddleware, profileController.communicationPreferences);
router.post('/addAvailibilty', authMiddleware, profileController.addAvailibilty);
router.post('/deleteAvailibilty', authMiddleware, profileController.deleteAvailibilty);
router.post('/deleteAvailibiltyForDay', authMiddleware, profileController.deleteAvailibiltyForDay);
router.post('/myAvailibilty', authMiddleware, profileController.myAvailibilty);
router.post('/getMatchingProfile', authMiddleware, profileController.getMatchingProfile);
router.post('/saveProfile', authMiddleware, profileController.saveProfile);
router.post('/getSavedProfile', authMiddleware, profileController.getSavedProfile);

//connection with mentee menter apis
router.post('/getUserProfile', authMiddleware, profileController.getUserProfile);
router.post('/sendUnConnectRequest', authMiddleware, profileController.sendUnConnectRequest);
router.post('/sendConnectRequest', authMiddleware, profileController.sendConnectRequest);
router.post('/getNotifications', authMiddleware, profileController.getNotifications);
router.post('/acceptDeclineConnectRequest', authMiddleware, profileController.acceptDeclineConnectRequest);
router.post('/recentMatches', authMiddleware, profileController.recentMatches);
router.post('/startConversation', authMiddleware, profileController.startConversation);
router.post('/getNewCoversations', authMiddleware, profileController.getNewCoversations);
router.post('/getOldConversations', authMiddleware, profileController.getOldConversations);
router.post('/sendMessage', authMiddleware, profileController.sendMessage);
router.post('/editMessage', authMiddleware, profileController.editMessage);

//meeting apis
router.post('/getChatSingleUser', authMiddleware, profileController.getChatSingleUser);
router.post('/enableMeeting', authMiddleware, profileController.enableMeeting);
router.post('/searchUser', authMiddleware, profileController.searchUser);
router.post('/getAvailableSlots', authMiddleware, profileController.getAvailableSlots);
router.post('/bookMeeting', authMiddleware, profileController.bookMeeting);
router.post('/editMeeting', authMiddleware, profileController.editMeeting);
router.post('/endMeeting', authMiddleware, profileController.endMeeting);
router.post('/cancelMeeting', authMiddleware, profileController.cancelMeeting);
router.post('/sendFeedBack', authMiddleware, profileController.sendFeedBack);
router.post('/getFeedbackDetails', authMiddleware, profileController.getFeedbackDetails);
router.post('/getUpcomingMeetings', authMiddleware, profileController.getUpcomingMeetings);
router.post('/getPastMeetings', authMiddleware, profileController.getPastMeetings);
router.post('/deletePastMeeting', authMiddleware, profileController.deletePastMeeting);
router.post('/enableFirstSession', authMiddleware, profileController.enableFirstSession);
router.post('/getPreviouslyInteracted', authMiddleware, profileController.getPreviouslyInteracted);

//contact us apis

router.post('/contactUs', authMiddleware, profileController.contactUs);


module.exports = router;
