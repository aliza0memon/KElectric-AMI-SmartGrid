const mongoose = require('mongoose');

async function createTimeSeriesCollection() {
  const db = mongoose.connection.db;

  const collections = await db.listCollections({ name: 'meter_readings' }).toArray();

  if (collections.length > 0) {
    console.log('meter_readings collection already exists. Skipping creation.');
    return;
  }

  await db.createCollection('meter_readings', {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'minutes'
    }
  });

  console.log('Time-series collection "meter_readings" created successfully.');
}

module.exports = createTimeSeriesCollection;