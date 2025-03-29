const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    //role: { type: String, enum: ['admin', 'superAdmin', 'user'], default: 'admin' },
    role: { type: String, enum: ['superAdmin'], default: 'superAdmin' }, // Only 'superAdmin' role
    profilePic: { type: String, default: '' }, 
    status: { type: Number, enum: [0, 1], default: 1 }, // 0 for inactive, 1 for active
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
