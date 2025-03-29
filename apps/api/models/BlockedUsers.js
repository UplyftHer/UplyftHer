const mongoose = require('mongoose');

const BlockedUsersSchema = new mongoose.Schema({
    cognitoUserId: { 
        type: String, 
    }, 
    blockedUserId: { 
        type: String, 
    }, 
    reason: { 
        type: String, 
    }, 
    status: { 
        type: Number,
        default:0   //blocked 1, unblocked 0
    }, 

},
{
    timestamps: true,
});

module.exports = mongoose.model('BlockedUsers', BlockedUsersSchema);