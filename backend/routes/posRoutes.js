const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const StockMovement = require('../models/StockMovement');
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');

// POST /api/pos/checkout - Process POS sale, deduct stock, update customer, record movements
router.post('/checkout', verifyToken, authorizeRoles('admin', 'cashier'), async (req, res) => {
  try {
    const {
      items,
      customerId,
      customerName,
      discountPercent = 0,
      taxPercent = 18,
      paymentMethod = 'cash',
      cashTendered = 0
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart must contain at least one item' });
    }

    // 1. Calculate subtotals
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      // Find product by id
      let prod = null;
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        prod = await Product.findById(item.productId);
      }
      if (!prod) {
        prod = await Product.findOne({ $or: [{ sku: item.sku }, { barcode: item.barcode }, { name: item.name }] });
      }

      const unitPrice = prod ? prod.price : Number(item.price);
      const unitCost = prod ? prod.cost : (Number(item.cost) || 0);
      const qty = Number(item.qty) || 1;
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;

      validatedItems.push({
        productId: prod ? prod._id.toString() : (item.productId || 'manual'),
        name: prod ? prod.name : item.name,
        sku: prod ? prod.sku : (item.sku || ''),
        qty,
        price: unitPrice,
        cost: unitCost,
        total: lineTotal
      });
    }

    const discountAmount = (subtotal * Number(discountPercent)) / 100;
    const taxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = (taxable * Number(taxPercent)) / 100;
    const grandTotal = taxable + taxAmount;
    const tendered = Number(cashTendered) || 0;
    const changeDue = Math.max(0, tendered - grandTotal);

    // Generate Invoice Number
    const count = await Sale.countDocuments();
    const invoiceNo = `INV-2026-${String(count + 1).padStart(4, '0')}`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    // 2. Create Sale in MongoDB
    const sale = await Sale.create({
      invoiceNo,
      date: dateStr,
      customerId: customerId || 'walkin',
      customerName: customerName || 'Walk-in Customer',
      paymentMethod,
      items: validatedItems,
      subtotal,
      discountPercent: Number(discountPercent),
      discountAmount,
      taxPercent: Number(taxPercent),
      taxAmount,
      grandTotal,
      cashier: req.user ? req.user.name : 'Cashier',
      cashTendered: tendered,
      changeDue
    });

    // 3. Deduct Inventory & Record Stock Movements in parallel
    for (const item of validatedItems) {
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        const prod = await Product.findById(item.productId);
        if (prod) {
          const prevQty = prod.stock;
          const newQty = Math.max(0, prod.stock - item.qty);
          prod.stock = newQty;
          await prod.save();

          await StockMovement.create({
            timestamp: dateStr,
            productName: prod.name,
            productId: prod._id.toString(),
            type: 'OUT',
            qty: item.qty,
            prevQty,
            newQty,
            reason: `POS Sale: ${invoiceNo}`,
            user: req.user ? req.user.name : 'Cashier'
          });
        }
      }
    }

    // 4. Update Customer lifetime spend if applicable
    if (customerId && customerId !== 'walkin' && customerId.match(/^[0-9a-fA-F]{24}$/)) {
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { totalSpent: grandTotal, orders: 1 }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Sale completed and inventory deducted successfully',
      data: sale
    });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed', details: err.message });
  }
});

// GET /api/pos/sales - Retrieve sales transaction register
router.get('/sales', verifyToken, async (req, res) => {
  try {
    const { search, paymentMethod } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { invoiceNo: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    const sales = await Sale.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: sales.length, data: sales });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve sales', details: err.message });
  }
});

// GET /api/pos/sales/:idOrInvoice - Get specific invoice details
router.get('/sales/:idOrInvoice', verifyToken, async (req, res) => {
  try {
    const param = req.params.idOrInvoice;
    let sale = null;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      sale = await Sale.findById(param);
    }
    if (!sale) {
      sale = await Sale.findOne({ invoiceNo: param.toUpperCase() });
    }

    if (!sale) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ success: true, data: sale });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve invoice', details: err.message });
  }
});

module.exports = router;
