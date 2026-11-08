require('dotenv').config();
const connectDB = require('../config/db');
const Consumer = require('../models/Consumer');
const SmartMeter = require('../models/SmartMeter');
const MeterReading = require('../models/MeterReading');

async function run() {
  await connectDB();

  const realConsumer = await Consumer.findOne();

  console.log('\n========== QUERY 1: Find consumer by email ==========');
  const q1 = await Consumer.find({ email: realConsumer.email }).explain('executionStats');
  printStats(q1);

  console.log('\n========== QUERY 2: Find meters by area ==========');
  const q2 = await SmartMeter.find({ 'location.area': 'Clifton' }).explain('executionStats');
  printStats(q2);

  console.log('\n========== QUERY 3: Find readings by meterId ==========');
  const q3 = await MeterReading.find({ 'metadata.meterId': 'MTR-0001' }).explain('executionStats');
  printTimeSeriesStats(q3);

  process.exit(0);
}

function printStats(explainResult) {
  const stats = explainResult.executionStats;
  const stage = stats.executionStages.stage
    || (stats.executionStages.inputStage && stats.executionStages.inputStage.stage)
    || 'UNKNOWN';
  console.log('Stage:', stage);
  console.log('Total docs examined:', stats.totalDocsExamined);
  console.log('Total keys examined:', stats.totalKeysExamined);
  console.log('Execution time (ms):', stats.executionTimeMillis);
  console.log('Documents returned:', stats.nReturned);
}

function printTimeSeriesStats(explainResult) {
  const json = JSON.stringify(explainResult);

  const stageMatch = json.match(/"stage":"(\w+)"/);
  const docsExaminedMatch = json.match(/"totalDocsExamined":(\d+)/) || json.match(/"docsExamined":(\d+)/);
  const keysExaminedMatch = json.match(/"totalKeysExamined":(\d+)/) || json.match(/"keysExamined":(\d+)/);
  const timeMatch = json.match(/"executionTimeMillis":(\d+)/);
  const nReturnedMatch = json.match(/"nReturned":(\d+)/);

  console.log('Stage:', stageMatch ? stageMatch[1] : 'See raw JSON below');
  console.log('Total docs examined:', docsExaminedMatch ? docsExaminedMatch[1] : 'N/A');
  console.log('Total keys examined:', keysExaminedMatch ? keysExaminedMatch[1] : 'N/A');
  console.log('Execution time (ms):', timeMatch ? timeMatch[1] : 'N/A');
  console.log('Documents returned:', nReturnedMatch ? nReturnedMatch[1] : 'N/A');
}

run().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});