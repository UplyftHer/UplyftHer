// const jwt = require('jsonwebtoken');
// const UsersModel = require('../models/UsersModel');

// const authMiddleware = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Get token from the 'Authorization' header

//     //console.log('Token:', token); // Log the token for debugging

//     if (!token) {
//         console.log('No token provided');
//         return res.status(401).json({status:0, message: 'No token provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.log('Token verification error:', err.message);
//             return res.status(401).json({ status:0, message: 'Unauthorized', error: err.message });
//         }
//         req.user = decoded; // Attach the decoded user information to the request
//         next(); // Proceed to the next middleware or route handler
//     });
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the 'Authorization' header

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ status: 0, message: 'No token provided' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request

        // Check if the user exists and if they are active
        const user = await UsersModel.findOne({cognitoUserId:decoded.username}); 
        if (!user) {
            console.log('User not found');
            //return res.json({ status: 0, message: 'User not found' });
            return res.status(403).json({ status: 0, message: 'User not found' });
        }
        else if (user.isActive == 0) {
            console.log('User is not active');
            //return res.json({ status: 0, message: 'Your account is temporarily restricted.' });
            return res.status(403).json({ status: 0, message: 'Your account is temporarily restricted.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.log('Token verification error:', err.message);
        return res.status(401).json({ status: 0, message: 'Unauthorized', error: err.message });
    }
};

module.exports = authMiddleware;

