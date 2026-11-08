const mongoose = require('mongoose');

const meterReadingSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  metadata: {
    meterId: { type: String, required: true },
    area: { type: String, required: true }
  },
  energyConsumption_kWh: {
    type: Number,
    required: true
  },
  voltage: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    required: true
  },
  powerFactor: {
    type: Number,
    required: true
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'minutes'
  },
  timestamps: false
});

module.exports = mongoose.model('MeterReading', meterReadingSchema, 'meter_readings');