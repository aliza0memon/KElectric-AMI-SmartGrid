const SmartMeter = require('../models/SmartMeter');

async function createMeter(data) {
  const meter = new SmartMeter(data);
  return await meter.save();
}

async function getAllMeters() {
  return await SmartMeter.find().populate('consumerId', 'name consumerId email');
}

async function getMeterById(meterId) {
  return await SmartMeter.findOne({ meterId }).populate('consumerId', 'name consumerId email');
}

async function searchMetersByArea(area) {
  return await SmartMeter.find({ 'location.area': { $regex: area, $options: 'i' } });
}

async function updateMeterStatus(meterId, newStatus) {
  return await SmartMeter.findOneAndUpdate(
    { meterId },
    { meterStatus: newStatus },
    { returnDocument: 'after', runValidators: true }
  );
}

async function deleteMeter(meterId) {
  return await SmartMeter.findOneAndDelete({ meterId });
}

module.exports = {
  createMeter,
  getAllMeters,
  getMeterById,
  searchMetersByArea,
  updateMeterStatus,
  deleteMeter
};