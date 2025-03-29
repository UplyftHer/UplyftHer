const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    fromCognitoId: { 
        type: String, 
    }, 
    toCognitoId: { 
        type: String, 
    }, 
    requestId: { 
        type: String, 
    }, 
    tableName: { 
        type: String, 
    }, 
    message: { 
        type: String, 
    }, 
    type: { 
        type: String, 
    }, 
    isRead: {
        type: Number,
        default:0  //default 0, read 1
    },
    isTakeAction: {
        type: Number,
        default:0  //no 0, yes 1
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('notifications', NotificationSchema);