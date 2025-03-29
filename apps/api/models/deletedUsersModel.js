const mongoose = require('mongoose');

const deletedUsersSchema = new mongoose.Schema({
    email: { 
        type: String, 
    }, 
    reason: { 
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

module.exports = mongoose.model('deletedUsers', deletedUsersSchema);