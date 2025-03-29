const mongoose = require('mongoose');

const SavedProfilesSchema = new mongoose.Schema({
    cognitoUserId: { 
        type: String, 
    }, 
    cognitoUserIdSave: { 
        type: String, 
    }, 
   
   
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

module.exports = mongoose.model('SavedProfiles', SavedProfilesSchema);
