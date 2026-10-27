const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/stock - List stock movements
router.get('/', verifyToken, async (req, res) => {
  try {
    const movements = await StockMovement.find().sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: movements.length, data: movements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve stock movements', details: err.message });
  }
});

// POST /api/stock/in - Record stock inward entry
router.post('/in', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { productId, qty, supplierName, invoiceRef, notes } = req.body;
    const quantity = parseInt(qty);
    if (!productId || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid product ID and positive quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const prevQty = product.stock;
    const newQty = prevQty + quantity;
    product.stock = newQty;
    await product.save();

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const movement = await StockMovement.create({
      timestamp: dateStr,
      productName: product.name,
      productId: product._id.toString(),
      type: 'IN',
      qty: quantity,
      prevQty,
      newQty,
      reason: `Purchase Inward ${invoiceRef ? '(' + invoiceRef + ')' : ''} from ${supplierName || 'Vendor'} ${notes ? '- ' + notes : ''}`.trim(),
      user: req.user ? req.user.role : 'Admin'
    });

    res.status(201).json({ success: true, message: 'Stock inward recorded', data: { product, movement } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record inward stock', details: err.message });
  }
});

// POST /api/stock/out - Record stock outward / adjustment entry
router.post('/out', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { productId, qty, reason, notes } = req.body;
    const quantity = parseInt(qty);
    if (!productId || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid product ID and positive quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (quantity > product.stock) {
      return res.status(400).json({ error: `Cannot deduct more than available stock (${product.stock})` });
    }

    const prevQty = product.stock;
    const newQty = prevQty - quantity;
    product.stock = newQty;
    await product.save();

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const movement = await StockMovement.create({
      timestamp: dateStr,
      productName: product.name,
      productId: product._id.toString(),
      type: 'OUT',
      qty: quantity,
      prevQty,
      newQty,
      reason: `${reason || 'Stock Adjustment'} ${notes ? '- ' + notes : ''}`.trim(),
      user: req.user ? req.user.role : 'Admin'
    });

    res.status(201).json({ success: true, message: 'Stock outward recorded', data: { product, movement } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record outward stock', details: err.message });
  }
});

module.exports = router;
