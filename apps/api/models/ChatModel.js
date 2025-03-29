const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    fromId: { 
        type: String, 
    }, 
    toId: { 
        type: String, 
    }, 
    connectedId: { 
        type: String, 
    }, 
    message: { 
        type: String, 
    }, 
    isRead: {
        type: Number,
        default:0  //unread 0, raed 1
    },
    messageType: {
        type: Number,
        default:0  //default 0, meeting 1
    },
    isEdit: {
        type: Number,
        default:0  //default 0, meeting 1
    },
    meetingId: {
        type: String, 
    },
    meetingTitle: {
        type: String, 
    },
    meetingDate: {
        type: String, 
    },
    meetingTime: {
        type: String, 
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('chats', ChatSchema);