const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
    },
    status: {
        type: Number,
        default:1   //from admin active 1, inactive 0
    },
    icon: {
        type: String, // URL of the image stored in AWS S3

    }
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Interests', IndustrySchema);
