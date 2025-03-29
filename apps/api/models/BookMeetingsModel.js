const mongoose = require('mongoose');

const BookMeetingsSchema = new mongoose.Schema({
    cognitoUserId: { 
        type: String, 
    }, 
    cognitoUserIdMenter: { 
        type: String, 
    }, 
    day: { 
        type: String, 
    }, 
    date: { 
        type: String, 
    }, 
    slot: { 
        type: String, 
    }, 
    slot24: { 
        type: String, 
    }, 
    meetingTitle: { 
        type: String, 
    }, 
    personalNote: { 
        type: String, 
    }, 
    mode: { 
        type: String, 
    }, 
    start_url: { 
        type: String, 
    }, 
    join_url: { 
        type: String, 
    }, 
    zoomMeetingId: { 
        type: String, 
    }, 
    status: {
        type: Number,
        default:0  // 0 default, 1 start, 2 end 
    },
    deleteByMenter: {
        type: Number,
        default:0  
    },
    deleteByMentee: {
        type: Number,
        default:0  
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('book_meetings', BookMeetingsSchema);