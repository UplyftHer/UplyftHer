const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.post('/confirmSignup', authController.confirmSignup);
router.post('/resendConfirmationCode', authController.resendConfirmationCode);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/confirmForgotPassword', authController.confirmForgotPassword);

router.get('/linkedin/callback', authController.linkedinCallback);
router.post('/signupWithLinkedIn', authController.signupWithLinkedIn);
router.post('/getCities', authController.getCities);
router.post('/getOrganizations', authController.getOrganizations);





module.exports = router;
