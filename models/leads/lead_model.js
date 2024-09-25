const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  leadNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true,
    length: 10
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  propertyNo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Disabled', 'Inactive'], 
    default: 'Active' 
  },
  createdon: {
    type: String,
    default: Date.now 
  },
  updatedon: {
    type: String,
    default: Date.now 
  }
});

module.exports = mongoose.model('Lead', leadSchema);
