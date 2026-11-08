require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');

async function dailyConsumption() {
  const result = await mongoose.connection.db.collection('meter_readings').aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        totalConsumption: { $sum: '$energyConsumption_kWh' },
        readingCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();

  console.log('\n========== PIPELINE 1: Daily Electricity Consumption ==========');
  console.table(result.slice(0, 10));
  return result;
}

async function topConsumers() {
  const result = await mongoose.connection.db.collection('meter_readings').aggregate([
    {
      $group: {
        _id: '$metadata.meterId',
        totalConsumption: { $sum: '$energyConsumption_kWh' }
      }
    },
    {
      $lookup: {
        from: 'smartmeters',
        localField: '_id',
        foreignField: 'meterId',
        as: 'meterInfo'
      }
    },
    { $unwind: '$meterInfo' },
    {
      $lookup: {
        from: 'consumers',
        localField: 'meterInfo.consumerId',
        foreignField: '_id',
        as: 'consumerInfo'
      }
    },
    { $unwind: '$consumerInfo' },
    {
      $project: {
        _id: 0,
        meterId: '$_id',
        consumerName: '$consumerInfo.name',
        area: '$meterInfo.location.area',
        totalConsumption: { $round: ['$totalConsumption', 2] }
      }
    },
    { $sort: { totalConsumption: -1 } },
    { $limit: 10 }
  ]).toArray();

  console.log('\n========== PIPELINE 2: Top 10 Highest-Consuming Consumers ==========');
  console.table(result);
  return result;
}
async function peakHourConsumption() {
  const result = await mongoose.connection.db.collection('meter_readings').aggregate([
    {
      $group: {
        _id: { $hour: '$timestamp' },
        avgConsumption: { $avg: '$energyConsumption_kWh' },
        totalConsumption: { $sum: '$energyConsumption_kWh' }
      }
    },
    {
      $project: {
        _id: 0,
        hour: '$_id',
        avgConsumption: { $round: ['$avgConsumption', 2] },
        totalConsumption: { $round: ['$totalConsumption', 2] }
      }
    },
    { $sort: { avgConsumption: -1 } }
  ]).toArray();

  console.log('\n========== PIPELINE 3: Peak-Hour Consumption ==========');
  console.table(result.slice(0, 10));
  return result;
}

async function monthlyRevenue() {
  const Bill = mongoose.connection.db.collection('bills');

  const result = await Bill.aggregate([
    {
      $group: {
        _id: { month: '$billingPeriod.month', year: '$billingPeriod.year' },
        totalRevenue: { $sum: '$amount' },
        totalBills: { $sum: 1 },
        paidBills: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
        },
        unpaidBills: {
          $sum: { $cond: [{ $ne: ['$paymentStatus', 'paid'] }, 1, 0] }
        }
      }
    },
    {
      $addFields: {
        collectionRatePercent: {
          $round: [{ $multiply: [{ $divide: ['$paidBills', '$totalBills'] }, 100] }, 1]
        }
      }
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        year: '$_id.year',
        totalRevenue: { $round: ['$totalRevenue', 2] },
        totalBills: 1,
        paidBills: 1,
        unpaidBills: 1,
        collectionRatePercent: 1
      }
    },
    { $sort: { year: 1, month: 1 } }
  ]).toArray();

  console.log('\n========== PIPELINE 4: Monthly Billing & Revenue Analysis ==========');
  console.table(result);
  return result;
}


async function outageDurationByArea() {
  const Outage = mongoose.connection.db.collection('outages');

  const result = await Outage.aggregate([
    {
      $match: { outageStatus: 'resolved' }
    },
    {
      $group: {
        _id: '$affectedArea',
        totalOutages: { $sum: 1 },
        totalDowntimeMinutes: { $sum: '$durationMinutes' },
        avgDurationMinutes: { $avg: '$durationMinutes' }
      }
    },
    {
      $project: {
        _id: 0,
        area: '$_id',
        totalOutages: 1,
        totalDowntimeMinutes: 1,
        avgDurationMinutes: { $round: ['$avgDurationMinutes', 1] }
      }
    },
    { $sort: { totalDowntimeMinutes: -1 } }
  ]).toArray();

  console.log('\n========== PIPELINE 5: Outage Duration by Area ==========');
  console.table(result);
  return result;
}

module.exports = { dailyConsumption, topConsumers, peakHourConsumption, monthlyRevenue, outageDurationByArea };

if (require.main === module) {
  connectDB().then(async () => {
    await dailyConsumption();
    await topConsumers();
    await peakHourConsumption();
    await monthlyRevenue();
    await outageDurationByArea();
    process.exit(0);
  });
}