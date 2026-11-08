const mongoose = require('mongoose');

const outageSchema = new mongoose.Schema({
  outageId: {
    type: String,
    required: true,
    unique: true
  },
  affectedArea: {
    type: String,
    required: true
  },
  relatedMeters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SmartMeter'
  }],
  startTime: {
    type: Date,
    required: true
  },
  restorationTime: {
    type: Date
  },
  durationMinutes: {
    type: Number
  },
  outageStatus: {
    type: String,
    enum: ['ongoing', 'resolved'],
    default: 'ongoing'
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Outage', outageSchema);