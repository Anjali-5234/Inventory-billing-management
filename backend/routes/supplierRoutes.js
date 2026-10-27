const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/suppliers
router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { categories: { $regex: search, $options: 'i' } }
      ];
    }

    const suppliers = await Supplier.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suppliers', details: err.message });
  }
});

// GET /api/suppliers/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, data: supplier });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch supplier', details: err.message });
  }
});

// POST /api/suppliers (Admin & Manager)
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, contact, phone, email, address, categories } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Supplier name and phone are required' });
    }

    const supplier = await Supplier.create({
      name,
      contact: contact || '',
      phone,
      email: email || '',
      address: address || '',
      categories: categories || ''
    });

    res.status(201).json({ success: true, message: 'Supplier registered successfully', data: supplier });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register supplier', details: err.message });
  }
});

// PUT /api/suppliers/:id (Admin & Manager)
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, message: 'Supplier updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update supplier', details: err.message });
  }
});

// DELETE /api/suppliers/:id (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ success: true, message: 'Supplier removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete supplier', details: err.message });
  }
});

module.exports = router;
