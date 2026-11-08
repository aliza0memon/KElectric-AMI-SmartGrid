const MeterReading = require('../models/MeterReading');

async function insertReading(data) {
  return await MeterReading.create(data);
}

async function getReadingsByMeter(meterId, limit = 50) {
  return await MeterReading.find({ 'metadata.meterId': meterId })
    .sort({ timestamp: -1 })
    .limit(limit);
}

async function getReadingsByDateRange(meterId, startDate, endDate) {
  return await MeterReading.find({
    'metadata.meterId': meterId,
    timestamp: { $gte: startDate, $lte: endDate }
  }).sort({ timestamp: 1 });
}

module.exports = {
  insertReading,
  getReadingsByMeter,
  getReadingsByDateRange
};