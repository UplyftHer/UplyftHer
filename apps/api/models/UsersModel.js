const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    cognitoUserId: {
        type: String,
    },
    email: {
        type: String,
    },
    myInvitationCode: {
        type: String,
    },
    invitationCode: {
        type: String,
    },
    fullName: { 
        type: String, 
    }, 
    age: { 
        type: String,
    }, 
    location: { 
        type: String, 
    }, 
    userType: { 
        type: Number, 
        enum: [0, 1], // 0 for mentee, 1 for mentor
    }, 
    registerBy: { 
        type: Number, 
        enum: [0, 1], // 0 for app, 1 for admin
        default:0
    }, 
    registerWith: { 
        type: Number, 
        enum: [0, 1], // 0 for email, 1 for linkedin
        default:0
    }, 
    occupation: { 
        type: String, 
    }, 
    isSaved: {
        type: Boolean, 
        default: true
    },
    organizationName: { 
        type: String, 
    }, 
    industry: { 
        type: String, 
    }, 
    interests: [{ 
        interestId: { type: String },
        name: { type: String },
    }], 
    bio: { 
        type: String, 
    },
    country: { 
        type: String, 
    },
    city: { 
        type: String, 
    },
    iso2: { 
        type: String, 
    },
    profilePic: { 
        type: String, 
    },
    preference: [{ 
        preferenceId: { type: String },
        type: { type: String },
    }],
    deviceToken: {
        type: Array,
        default:[]
    },
    isCreateProfile: {
        type: Number,
        default:0
    },
    isVerified: {
        type: Number,
        default:0  //email verified 1 not verified 0
    },
    emailDomainVerified: {
        type: Number,
        default:0  //email verified 1 not verified 0
    },
    isActive: {
        type: Number,
        default:1   //from admin active 1, inactive 0
    },
    isMatchAvailibilty: {
        type: Number,
        default:1   //from admin active 1, inactive 0
    },
    communicationPreferences: {
        videoCall: { type: Number, default: 0 },
        audioCall: { type: Number, default: 0 },
        inPerson: { type: Number, default: 0 },
    },
},
{
    timestamps: true,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
