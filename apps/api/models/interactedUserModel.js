const mongoose = require('mongoose');

const interactedUserSchema = new mongoose.Schema({
    fromcognitoUserId: { 
        type: String, 
    }, 
    tocognitoUserId: { 
        type: String, 
    }, 
   
   
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

module.exports = mongoose.model('interacted_users', interactedUserSchema);