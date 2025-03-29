const mongoose = require('mongoose');

const DomainManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Number,
    default:1   //from admin active 1, inactive 0
}
}, { timestamps: true });

module.exports = mongoose.model('DomainManager', DomainManagerSchema);
