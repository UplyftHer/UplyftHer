const mongoose = require('mongoose');

const adminInvitationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    invitationCode: {
        type: String,
    },
    registerusercount: {
    type: Number,
    default: 0,  // 0 = inactive, 1 = active
  },
});

const AdminInvitationCode = mongoose.model('AdminInvitationCode', adminInvitationCodeSchema);

module.exports = AdminInvitationCode;
