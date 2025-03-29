const mongoose = require('mongoose');

const ConnectedUserSchema = new mongoose.Schema({
    cognitoUserId: { 
        type: String, 
    }, 
    cognitoUserIdSave: { 
        type: String, 
    }, 
    status: {
        type: Number,
        default:0  //default 0, accept 1 reject 2
    },
    isMeetingEnable: {
        type: Number,
        default:0  //disable 0, enable 1
    },
    // startConversation: {
    //     type: Number,
    //     default:0  //disable 0, enable 1
    // },
    startConversation: {
        type: [String], // Array of user IDs
        default: [],    // Default is an empty array
    },
    isChat: {
        type: Number,
        default:0  //disable 0, enable 1
    },
    isBookFirstSession: {
        type: Number,
        default:0  //no 0, yes 1
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model('connected_users', ConnectedUserSchema);