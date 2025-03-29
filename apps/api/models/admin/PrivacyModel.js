const mongoose = require('mongoose');

const PrivacyPolicySchema = new mongoose.Schema({
  content: { type: String, required: true },
});

module.exports = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);

