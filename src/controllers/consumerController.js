const Consumer = require('../models/Consumer');

// CREATE
async function createConsumer(data) {
  const consumer = new Consumer(data);
  return await consumer.save();
}

// READ - get all
async function getAllConsumers() {
  return await Consumer.find();
}

// READ - get one by consumerId
async function getConsumerById(consumerId) {
  return await Consumer.findOne({ consumerId });
}

// READ - search by name (case-insensitive partial match)
async function searchConsumersByName(nameQuery) {
  return await Consumer.find({
    name: { $regex: nameQuery, $options: 'i' }
  });
}

// UPDATE
async function updateConsumer(consumerId, updates) {
 return await Consumer.findOneAndUpdate(
  { consumerId },
  updates,
  { returnDocument: 'after', runValidators: true }
);
}

// DELETE
async function deleteConsumer(consumerId) {
  return await Consumer.findOneAndDelete({ consumerId });
}

module.exports = {
  createConsumer,
  getAllConsumers,
  getConsumerById,
  searchConsumersByName,
  updateConsumer,
  deleteConsumer
};