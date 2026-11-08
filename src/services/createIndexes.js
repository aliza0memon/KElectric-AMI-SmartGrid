require('dotenv').config();
const connectDB = require('../config/db');
const SmartMeter = require('../models/SmartMeter');
const Bill = require('../models/Bill');
const Outage = require('../models/Outage');
const MeterReading = require('../models/MeterReading');

async function run() {
  await connectDB();

  console.log('Creating indexes...\n');

  await SmartMeter.collection.createIndex({ 'location.area': 1 });
  console.log('Index created: smart_meters.location.area');

  await SmartMeter.collection.createIndex({ consumerId: 1 });
  console.log('Index created: smart_meters.consumerId');

  await Bill.collection.createIndex({ consumerId: 1 });
  console.log('Index created: bills.consumerId');

  await Bill.collection.createIndex({ paymentStatus: 1 });
  console.log('Index created: bills.paymentStatus');

  await Outage.collection.createIndex({ affectedArea: 1 });
  console.log('Index created: outages.affectedArea');

  await MeterReading.collection.createIndex({ 'metadata.meterId': 1 });
  console.log('Index created: meter_readings.metadata.meterId');

  console.log('\nAll indexes created successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});