const mongoose = require('mongoose');

const TermsSchema = new mongoose.Schema({
  content: { type: String, required: true },
});

module.exports = mongoose.model('Cookies', TermsSchema);