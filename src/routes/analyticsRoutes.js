const express = require('express');
const router = express.Router();
const {
  dailyConsumption,
  topConsumers,
  peakHourConsumption,
  monthlyRevenue,
  outageDurationByArea
} = require('../services/aggregations');

router.get('/daily-consumption', async (req, res) => {
  try {
    res.json(await dailyConsumption());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/top-consumers', async (req, res) => {
  try {
    res.json(await topConsumers());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/peak-hours', async (req, res) => {
  try {
    res.json(await peakHourConsumption());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/monthly-revenue', async (req, res) => {
  try {
    res.json(await monthlyRevenue());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/outages-by-area', async (req, res) => {
  try {
    res.json(await outageDurationByArea());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;