const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    required: true,
    unique: true
  },
  consumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consumer',
    required: true
  },
  billingPeriod: {
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, required: true }
  },
  unitsConsumed: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'overdue'],
    default: 'unpaid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);