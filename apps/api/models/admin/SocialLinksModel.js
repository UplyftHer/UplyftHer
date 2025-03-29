const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    accountStatus: {
        type: Number,
        default:1   //from admin active 1, inactive 0
    },
    image: {
        type: String, // S3 URL will be stored here
        default: null
    },
}, { timestamps: true });

const SocialLinks = mongoose.model('SocialLinks', SocialLinksSchema);

module.exports = SocialLinks;
