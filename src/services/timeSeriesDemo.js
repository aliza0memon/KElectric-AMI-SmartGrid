require('dotenv').config();
const connectDB = require('../config/db');
const MeterReading = require('../models/MeterReading');

async function run() {
  await connectDB();

  console.log('\n========== Time-range query: last 24 hours for MTR-0001 ==========');
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentReadings = await MeterReading.find({
    'metadata.meterId': 'MTR-0001',
    timestamp: { $gte: yesterday, $lte: now }
  }).sort({ timestamp: 1 });

  console.log(`Found ${recentReadings.length} readings in the last 24 hours.`);
  console.log('First reading:', recentReadings[0]?.timestamp, '-', recentReadings[0]?.energyConsumption_kWh, 'kWh');
  console.log('Last reading:', recentReadings[recentReadings.length - 1]?.timestamp, '-', recentReadings[recentReadings.length - 1]?.energyConsumption_kWh, 'kWh');

  console.log('\n========== Aggregation on time-series: hourly averages for MTR-0001 ==========');
  const hourlyAvg = await MeterReading.aggregate([
    { $match: { 'metadata.meterId': 'MTR-0001' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' } },
        avgVoltage: { $avg: '$voltage' },
        avgPowerFactor: { $avg: '$powerFactor' }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 5 }
  ]);

  console.table(hourlyAvg);

  process.exit(0);
}

run().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});