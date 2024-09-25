const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false 
  },
  email: {
    type: String,
    required: false, 
    unique: true 
  },
  password: {
    type: String,
    required: false 
  },
  primaryPhone: {
    type: String,
    required: false 
  },
  secondaryPhone: {
    type: String,
    required: false 
  },
  role: {
    type: String,
    required: false 
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive',
    required: false 
  },
  createdOn: {
    type: String,
    required: false 
  },
  updatedOn: {
    type: String,
    required: false 
  },
  createdBy: {
    type: String,
    required: false 
  },
  profilePhoto: {
    type: String,
    required: false 
  },
  reason: {
    type: String,
    required: false 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
