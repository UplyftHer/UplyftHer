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
   
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Industry', IndustrySchema);
