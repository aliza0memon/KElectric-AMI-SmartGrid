const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema({
  consumerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    area: String
  },
  connectionType: {
    type: String,
    enum: ['residential', 'commercial', 'industrial'],
    default: 'residential'
  },
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Consumer', consumerSchema);