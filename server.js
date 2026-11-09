require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const consumerRoutes = require('./src/routes/consumerRoutes');
const smartMeterRoutes = require('./src/routes/smartMeterRoutes');
const billRoutes = require('./src/routes/billRoutes');
const outageRoutes = require('./src/routes/outageRoutes');
const readingRoutes = require('./src/routes/readingRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'K-Electric AMI API is running' });
});

app.use('/api/consumers', consumerRoutes);
app.use('/api/meters', smartMeterRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/outages', outageRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/analytics', analyticsRoutes);

connectDB();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;