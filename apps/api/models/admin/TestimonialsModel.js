const mongoose = require('mongoose');

const TestimonialsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    country: { type: String, required: true },
    bio: { type: String, required: true },
    status: {
        type: Number,
        default:1   //from admin active 1, inactive 0
    },
    image: { type: String, default: '' } // URL of the uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Testimonials', TestimonialsSchema);
