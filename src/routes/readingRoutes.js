const express = require('express');
const router = express.Router();
const {
  insertReading,
  getReadingsByMeter,
  getReadingsByDateRange
} = require('../controllers/meterReadingController');

router.post('/', async (req, res) => {
  try {
    const reading = await insertReading(req.body);
    res.status(201).json(reading);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:meterId', async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    const readings = (startDate && endDate)
      ? await getReadingsByDateRange(req.params.meterId, new Date(startDate), new Date(endDate))
      : await getReadingsByMeter(req.params.meterId, limit ? parseInt(limit) : 50);
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;