const Outage = require('../models/Outage');

async function createOutage(data) {
  const outage = new Outage(data);
  return await outage.save();
}

async function getAllOutages() {
  return await Outage.find().populate('relatedMeters', 'meterId location');
}

async function getOutagesByArea(area) {
  return await Outage.find({ affectedArea: { $regex: area, $options: 'i' } });
}

async function resolveOutage(outageId, restorationTime) {
  const outage = await Outage.findOne({ outageId });
  const durationMinutes = Math.round((restorationTime - outage.startTime) / 60000);

  return await Outage.findOneAndUpdate(
    { outageId },
    { restorationTime, durationMinutes, outageStatus: 'resolved' },
    { returnDocument: 'after', runValidators: true }
  );
}

async function deleteOutage(outageId) {
  return await Outage.findOneAndDelete({ outageId });
}

module.exports = {
  createOutage,
  getAllOutages,
  getOutagesByArea,
  resolveOutage,
  deleteOutage
};