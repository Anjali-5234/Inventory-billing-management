const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const verifyToken = require('../middleware/auth');

// GET /api/customers
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ totalSpent: -1 });
    res.json({ success: true, count: customers.length, data: customers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers', details: err.message });
  }
});

// GET /api/customers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer', details: err.message });
  }
});

// POST /api/customers
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, phone, email, city, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      city: city || address || '',
      address: address || city || ''
    });

    res.status(201).json({ success: true, message: 'Customer registered successfully', data: customer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer', details: err.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true, message: 'Customer updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer', details: err.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    res.json({ success: true, message: 'Customer removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer', details: err.message });
  }
});

module.exports = router;
