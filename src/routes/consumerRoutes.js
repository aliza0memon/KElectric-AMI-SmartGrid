const express = require('express');
const router = express.Router();
const {
  createConsumer,
  getAllConsumers,
  getConsumerById,
  searchConsumersByName,
  updateConsumer,
  deleteConsumer
} = require('../controllers/consumerController');

router.post('/', async (req, res) => {
  try {
    const consumer = await createConsumer(req.body);
    res.status(201).json(consumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const consumers = search
      ? await searchConsumersByName(search)
      : await getAllConsumers();
    res.json(consumers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:consumerId', async (req, res) => {
  try {
    const consumer = await getConsumerById(req.params.consumerId);
    if (!consumer) return res.status(404).json({ error: 'Consumer not found' });
    res.json(consumer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:consumerId', async (req, res) => {
  try {
    const consumer = await updateConsumer(req.params.consumerId, req.body);
    if (!consumer) return res.status(404).json({ error: 'Consumer not found' });
    res.json(consumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:consumerId', async (req, res) => {
  try {
    const consumer = await deleteConsumer(req.params.consumerId);
    if (!consumer) return res.status(404).json({ error: 'Consumer not found' });
    res.json({ message: 'Consumer deleted successfully', consumer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;