const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
    cognitoUserId: {
        type: String,
    },
    slots: [{ 
        type: {
            type: String,
            enum: ['day', 'date'], 
        },
        status: {
            type: Number,
            default:1  //enabled 1 disabled 0
        },
        name: { type: String },
        slot: [{ 
            time: { type: String }
        }],
    }]
},
{
    timestamps: true,
});

module.exports = mongoose.model('availability', AvailabilitySchema);