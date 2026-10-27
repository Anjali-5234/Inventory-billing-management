const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// GET /api/products - List products with optional search and filters
router.get('/', async (req, res) => {
  try {
    const { search, category, stock } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    if (stock === 'low') {
      query.$expr = { $lte: ['$stock', '$minStock'] };
      query.stock = { $gt: 0 };
    } else if (stock === 'out') {
      query.stock = { $lte: 0 };
    } else if (stock === 'available') {
      query.$expr = { $gt: ['$stock', '$minStock'] };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// GET /api/products/:idOrBarcode - Find product by id or barcode
router.get('/:idOrBarcode', async (req, res) => {
  try {
    const param = req.params.idOrBarcode;
    let product = null;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(param);
    }
    if (!product) {
      product = await Product.findOne({ $or: [{ barcode: param }, { sku: param.toUpperCase() }] });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product', details: err.message });
  }
});

// POST /api/products - Create new product (Admin & Manager only)
router.post('/', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { name, category, sku, barcode, cost, price, stock, minStock, unit } = req.body;

    if (!name || !sku || !barcode || price === undefined) {
      return res.status(400).json({ error: 'Name, SKU, Barcode, and Price are required' });
    }

    const existingSku = await Product.findOne({ sku: sku.toUpperCase().trim() });
    if (existingSku) {
      return res.status(409).json({ error: `SKU '${sku}' already exists` });
    }

    const existingBarcode = await Product.findOne({ barcode: barcode.trim() });
    if (existingBarcode) {
      return res.status(409).json({ error: `Barcode '${barcode}' already exists` });
    }

    const product = await Product.create({
      name,
      category: category || 'General',
      sku: sku.toUpperCase().trim(),
      barcode: barcode.trim(),
      cost: Number(cost) || 0,
      price: Number(price),
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 10,
      unit: unit || 'pcs'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

// PUT /api/products/:id - Update product (Admin & Manager only)
router.put('/:id', verifyToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: `Product '${deleted.name}' deleted successfully`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

module.exports = router;
