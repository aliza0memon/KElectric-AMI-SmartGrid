const mongoose = require('mongoose');

const smartMeterSchema = new mongoose.Schema({
  meterId: {
    type: String,
    required: true,
    unique: true
  },
  consumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consumer',
    required: true
  },
  installationDate: {
    type: Date,
    required: true
  },
  meterType: {
    type: String,
    enum: ['single-phase', 'three-phase', 'smart-prepaid'],
    default: 'single-phase'
  },
  meterStatus: {
    type: String,
    enum: ['active', 'faulty', 'inactive'],
    default: 'active'
  },
  location: {
    area: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SmartMeter', smartMeterSchema);