const mongoose = require('mongoose');

const UnConnectedUserSchema = new mongoose.Schema({
    cognitoUserId: { 
        type: String, 
    }, 
    cognitoUserIdSave: { 
        type: String, 
    }, 
    status: {
        type: Number,
        default:0  
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('unconnected_users', UnConnectedUserSchema);