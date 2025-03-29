const express = require('express');
const googleController = require('../controllers/googleController');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


router.post('/searchGooglePlaces', authMiddleware, googleController.searchGooglePlaces); //

module.exports = router;