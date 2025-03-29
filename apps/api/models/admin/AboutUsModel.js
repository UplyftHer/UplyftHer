const mongoose = require('mongoose');
const AboutUsSchema = new mongoose.Schema({
  content: { type: String, 
    required: true }, 
});

module.exports = mongoose.model('AboutUs', AboutUsSchema);

