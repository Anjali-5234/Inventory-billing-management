const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/settings - Retrieve store configuration
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        name: 'Apex Retail Hypermarket',
        gst: 'GSTIN27AABCU9603R1ZM',
        address: '452 Commerce Avenue, Silicon Tech Hub, Mumbai 400001',
        phone: '+91 98765 43210 | billing@apexstock.com',
        currency: '₹',
        footer: 'Thank you for your business! Goods once sold can be returned within 7 days.'
      });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve settings', details: err.message });
  }
});

// PUT /api/settings - Update store configuration (Admin only)
router.put('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings', details: err.message });
  }
});

module.exports = router;
