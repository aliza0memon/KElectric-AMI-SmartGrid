const express = require('express');
const router = express.Router();
const {
  createMeter,
  getAllMeters,
  getMeterById,
  searchMetersByArea,
  updateMeterStatus,
  deleteMeter
} = require('../controllers/smartMeterController');

router.post('/', async (req, res) => {
  try {
    const meter = await createMeter(req.body);
    res.status(201).json(meter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { area } = req.query;
    const meters = area ? await searchMetersByArea(area) : await getAllMeters();
    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:meterId', async (req, res) => {
  try {
    const meter = await getMeterById(req.params.meterId);
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json(meter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:meterId/status', async (req, res) => {
  try {
    const meter = await updateMeterStatus(req.params.meterId, req.body.meterStatus);
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json(meter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:meterId', async (req, res) => {
  try {
    const meter = await deleteMeter(req.params.meterId);
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json({ message: 'Meter deleted successfully', meter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;