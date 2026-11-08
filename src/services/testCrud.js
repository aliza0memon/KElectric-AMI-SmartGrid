require('dotenv').config();
const connectDB = require('../config/db');
const {
  createConsumer,
  getAllConsumers,
  getConsumerById,
  searchConsumersByName,
  updateConsumer,
  deleteConsumer
} = require('../controllers/consumerController');

async function run() {
  await connectDB();

  console.log('\n--- CREATE ---');
  const newConsumer = await createConsumer({
    consumerId: 'CON-TEST-01',
    name: 'Test User',
    email: 'testuser@example.com',
    phone: '0300-1234567',
    address: { street: 'Test Street', city: 'Karachi', area: 'Clifton' },
    connectionType: 'residential',
    accountStatus: 'active'
  });
  console.log('Created:', newConsumer.name, newConsumer.consumerId);

  console.log('\n--- READ (all, count only) ---');
  const all = await getAllConsumers();
  console.log('Total consumers:', all.length);

  console.log('\n--- READ (by ID) ---');
  const found = await getConsumerById('CON-TEST-01');
  console.log('Found:', found.name, found.email);

  console.log('\n--- SEARCH (by name) ---');
  const searchResults = await searchConsumersByName('Test');
  console.log('Search results:', searchResults.map(c => c.name));

  console.log('\n--- UPDATE ---');
  const updated = await updateConsumer('CON-TEST-01', { accountStatus: 'suspended' });
  console.log('Updated status:', updated.accountStatus);

  console.log('\n--- DELETE ---');
  const deleted = await deleteConsumer('CON-TEST-01');
  console.log('Deleted:', deleted.name);

  console.log('\nAll CRUD operations tested successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});