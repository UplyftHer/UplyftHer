const mongoose = require('mongoose');

const organizationsSchema = new mongoose.Schema({
    
    
    organizationName: {
        type: String,
    },
   
},
{
    timestamps: true,
});

const organizations = mongoose.model('organizations', organizationsSchema);

module.exports = organizations;
