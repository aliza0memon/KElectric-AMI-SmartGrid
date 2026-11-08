require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const createTimeSeriesCollection = require('../config/createTimeSeries');

const Consumer = require('../models/Consumer');
const SmartMeter = require('../models/SmartMeter');
const Bill = require('../models/Bill');
const Outage = require('../models/Outage');
const MeterReading = require('../models/MeterReading');

const AREAS = ['Clifton', 'Gulshan', 'North Nazimabad', 'Malir', 'Korangi', 'Saddar'];
const CONNECTION_TYPES = ['residential', 'commercial', 'industrial'];

async function seedDatabase() {
  await connectDB();
  await createTimeSeriesCollection();

  console.log('Clearing old data...');
  await Consumer.deleteMany({});
  await SmartMeter.deleteMany({});
  await Bill.deleteMany({});
  await Outage.deleteMany({});
  await mongoose.connection.db.collection('meter_readings').deleteMany({});

  console.log('Seeding consumers...');
  const consumers = [];
  for (let i = 1; i <= 30; i++) {
    consumers.push({
      consumerId: `CON-${String(i).padStart(4, '0')}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: 'Karachi',
        area: faker.helpers.arrayElement(AREAS)
      },
      connectionType: faker.helpers.arrayElement(CONNECTION_TYPES),
      accountStatus: 'active'
    });
  }
  const savedConsumers = await Consumer.insertMany(consumers);
  console.log(`${savedConsumers.length} consumers created.`);

  console.log('Seeding smart meters...');
  const meters = [];
  for (let i = 0; i < savedConsumers.length; i++) {
    meters.push({
      meterId: `MTR-${String(i + 1).padStart(4, '0')}`,
      consumerId: savedConsumers[i]._id,
      installationDate: faker.date.past({ years: 2 }),
      meterType: faker.helpers.arrayElement(['single-phase', 'three-phase', 'smart-prepaid']),
      meterStatus: 'active',
      location: {
        area: savedConsumers[i].address.area,
        coordinates: { lat: 24.8 + Math.random() * 0.3, lng: 67.0 + Math.random() * 0.3 }
      }
    });
  }
  const savedMeters = await SmartMeter.insertMany(meters);
  console.log(`${savedMeters.length} smart meters created.`);

  console.log('Seeding bills...');
  const bills = [];
  const months = [8, 9, 10];
  for (const consumer of savedConsumers) {
    for (const month of months) {
      const units = Math.floor(100 + Math.random() * 400);
      bills.push({
        billId: `BILL-${consumer.consumerId}-${month}`,
        consumerId: consumer._id,
        billingPeriod: { month, year: 2026 },
        unitsConsumed: units,
        amount: Math.round(units * 28.5),
        dueDate: new Date(2026, month, 15),
        paymentStatus: faker.helpers.arrayElement(['paid', 'paid', 'unpaid', 'overdue'])
      });
    }
  }
  await Bill.insertMany(bills);
  console.log(`${bills.length} bills created.`);

  console.log('Seeding outages...');
  const outages = [];
  for (let i = 1; i <= 15; i++) {
    const area = faker.helpers.arrayElement(AREAS);
    const metersInArea = savedMeters.filter(m => m.location.area === area);
    const start = faker.date.recent({ days: 60 });
    const durationMin = Math.floor(30 + Math.random() * 240);
    const resolved = Math.random() > 0.2;

    outages.push({
      outageId: `OUT-${String(i).padStart(4, '0')}`,
      affectedArea: area,
      relatedMeters: metersInArea.slice(0, 3).map(m => m._id),
      startTime: start,
      restorationTime: resolved ? new Date(start.getTime() + durationMin * 60000) : null,
      durationMinutes: resolved ? durationMin : null,
      outageStatus: resolved ? 'resolved' : 'ongoing',
      description: faker.helpers.arrayElement([
        'Transformer fault', 'Scheduled maintenance', 'Cable fault', 'Overload tripping'
      ])
    });
  }
  await Outage.insertMany(outages);
  console.log(`${outages.length} outages created.`);

  console.log('Seeding meter readings (this may take a moment)...');
  const readings = [];
  const now = new Date();
  for (const meter of savedMeters) {
    for (let hoursAgo = 168; hoursAgo >= 0; hoursAgo -= 1) {
      const ts = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      readings.push({
        timestamp: ts,
        metadata: {
          meterId: meter.meterId,
          area: meter.location.area
        },
        energyConsumption_kWh: Number((0.5 + Math.random() * 4.5).toFixed(2)),
        voltage: Number((215 + Math.random() * 10).toFixed(1)),
        current: Number((1 + Math.random() * 9).toFixed(2)),
        powerFactor: Number((0.85 + Math.random() * 0.14).toFixed(2))
      });
    }
  }
  await mongoose.connection.db.collection('meter_readings').insertMany(readings);
  console.log(`${readings.length} meter readings created.`);

  console.log('Seeding complete!');
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});