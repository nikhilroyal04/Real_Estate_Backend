const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false 
  },
  email: {
    type: String,
    required: false 
  },
  phoneNumber: {
    type: String,
    required: false 
  },
  message: {
    type: String,
    required: false 
  },
  preferredAvailableTime: {
    type: String,
    required: false 
  },
  status: {
    type: String,
    enum: ['Connected', 'notConnected', 'Other'],
    default: 'notConnected'
  },
  statusReason: {
    type: String,
    required: function() { return this.status === 'Other'; } 
  }
});

module.exports = mongoose.model('Contact', contactSchema);
