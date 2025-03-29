const express = require('express');
const router = express.Router();
const AdminController = require("../../controllers/admin/Admincontroller");
const IndustryController = require('../../controllers/admin/IndustryController');
const InterestsController = require('../../controllers/admin/InterestsController');
const DomainManagerController = require('../../controllers/admin/DomainManagerController');

const adminProfileController = require('../../controllers/admin/adminProfileController');
const TestimonialsController = require('../../controllers/admin/TestimonialsController'); 
const TermsController = require('../../controllers/admin/TermsController');
const SocialLinksController = require('../../controllers/admin/SocialLinksController'); 
const PrivacyPolicyController = require('../../controllers/admin/PrivacyPolicyController'); 
const AboutUsController = require('../../controllers/admin/AboutUsController'); 

router.post("/signup", AdminController.signup);
// router.post('/confirmSignup', AdminController.confirmSignup);
// router.post('/resendConfirmationCode', AdminController.resendConfirmationCode);
router.post('/sendCongratulationsEmail', AdminController.sendCongratulationsEmail);
router.get('/getAlluser', AdminController.getAllUsers);
router.post('/update-status', AdminController.updateUserStatus);
router.delete('/deleteUser/:userId', AdminController.deleteUser);



// industriesrouter
router.get('/industries', IndustryController.getAllIndustries);
router.post('/industries', IndustryController.addIndustry);
router.put('/industries/:id', IndustryController.updateIndustry);
router.delete('/industries/:id', IndustryController.deleteIndustry);
// interests
router.get('/interests', InterestsController.getAllInterests);
router.post('/interests', InterestsController.addInterests);
router.get('/interests/:id', InterestsController.getInterestsById);
router.put('/interests/:id', InterestsController.updateInterests);
router.delete('/interests/:id', InterestsController.deleteInterests);

router.get('/domains', DomainManagerController.getAllDomains);
router.post('/domains', DomainManagerController.addDomain);
router.get('/domains/:id', DomainManagerController.getDomainById);
router.put('/domains/:id', DomainManagerController.updateDomain);
router.delete('/domains/:id', DomainManagerController.deleteDomain);

// Admin login route
router.get('/getgraphData', adminProfileController.getgraphData);
// router.post('/getUpcomingMeetings', adminProfileController.getUpcomingMeetings);
router.post('/login', adminProfileController.login);
//router.post('/add-admin', adminProfileController.addAdmin);
router.post('/loginAdminDetail', adminProfileController.loginAdminDetail);
router.put('/updateProfile', adminProfileController.updateProfile);
//router.post('/resetPassword', adminProfileController.resetPassword);
router.post('/UpdatePassword', adminProfileController.UpdatePassword);
router.post('/logout', adminProfileController.logout);

// RoutesTestimonials
router.get('/testimonials', TestimonialsController.getAllTestimonials);
router.post('/testimonials', TestimonialsController.addTestimonial);
router.get('/testimonials/:id', TestimonialsController.getTestimonialById);
router.put('/testimonials/:id', TestimonialsController.updateTestimonial);
router.delete('/testimonials/:id', TestimonialsController.deleteTestimonial);


// Get Terms & Conditions
router.get('/terms', TermsController.getTerms);
router.post('/terms', TermsController.saveOrUpdateTerms);
// Get privacy-policy
router.get('/privacy-policy', PrivacyPolicyController.getTerms);
router.post('/privacy-policy', PrivacyPolicyController.saveOrUpdateTerms);


// Route to get About Us content
router.get('/about-us', AboutUsController.getAboutUsContent);
router.post('/about-us', AboutUsController.saveOrUpdateAboutUsContent); 


// Get all social links
router.get('/social-links', SocialLinksController.getAllSocialLinks);
router.post('/social-links', SocialLinksController.addSocialLink);
router.get('/social-links/:id', SocialLinksController.getSocialLinkById);
router.put('/social-links/:id', SocialLinksController.updateSocialLink);
router.delete('/social-links/:id', SocialLinksController.deleteSocialLink);



module.exports = router;



