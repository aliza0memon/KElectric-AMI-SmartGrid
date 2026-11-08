const express = require('express');
const router = express.Router();
const {
  createOutage,
  getAllOutages,
  getOutagesByArea,
  resolveOutage,
  deleteOutage
} = require('../controllers/outageController');

router.post('/', async (req, res) => {
  try {
    const outage = await createOutage(req.body);
    res.status(201).json(outage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { area } = req.query;
    const outages = area ? await getOutagesByArea(area) : await getAllOutages();
    res.json(outages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:outageId/resolve', async (req, res) => {
  try {
    const restorationTime = new Date(req.body.restorationTime);
    const outage = await resolveOutage(req.params.outageId, restorationTime);
    if (!outage) return res.status(404).json({ error: 'Outage not found' });
    res.json(outage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:outageId', async (req, res) => {
  try {
    const outage = await deleteOutage(req.params.outageId);
    if (!outage) return res.status(404).json({ error: 'Outage not found' });
    res.json({ message: 'Outage deleted successfully', outage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;