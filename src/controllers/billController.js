const Bill = require('../models/Bill');

async function createBill(data) {
  const bill = new Bill(data);
  return await bill.save();
}

async function getAllBills() {
  return await Bill.find().populate('consumerId', 'name consumerId');
}

async function getBillsByConsumer(consumerObjectId) {
  return await Bill.find({ consumerId: consumerObjectId });
}

async function updatePaymentStatus(billId, status) {
  return await Bill.findOneAndUpdate(
    { billId },
    { paymentStatus: status },
    { returnDocument: 'after', runValidators: true }
  );
}

async function deleteBill(billId) {
  return await Bill.findOneAndDelete({ billId });
}

module.exports = {
  createBill,
  getAllBills,
  getBillsByConsumer,
  updatePaymentStatus,
  deleteBill
};