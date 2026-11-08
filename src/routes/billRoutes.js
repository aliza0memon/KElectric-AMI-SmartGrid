const express = require('express');
const router = express.Router();
const {
  createBill,
  getAllBills,
  getBillsByConsumer,
  updatePaymentStatus,
  deleteBill
} = require('../controllers/billController');

router.post('/', async (req, res) => {
  try {
    const bill = await createBill(req.body);
    res.status(201).json(bill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bills = await getAllBills();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:billId/payment', async (req, res) => {
  try {
    const bill = await updatePaymentStatus(req.params.billId, req.body.paymentStatus);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:billId', async (req, res) => {
  try {
    const bill = await deleteBill(req.params.billId);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json({ message: 'Bill deleted successfully', bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;