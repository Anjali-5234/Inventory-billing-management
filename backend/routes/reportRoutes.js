const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');

// GET /api/reports/dashboard - Aggregated financial metrics
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);

    const [sales, products] = await Promise.all([
      Sale.find(),
      Product.find()
    ]);

    const grossRevenue = sales.reduce((acc, s) => acc + (s.grandTotal || 0), 0);
    const todaySales = sales
      .filter(s => s.date && s.date.startsWith(todayStr))
      .reduce((acc, s) => acc + (s.grandTotal || 0), 0);

    let totalCogs = 0;
    sales.forEach(s => {
      s.items.forEach(i => {
        totalCogs += (i.cost || (i.price * 0.6)) * (i.qty || 1);
      });
    });
    const grossProfit = Math.max(0, grossRevenue - totalCogs);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

    // Category distribution
    const categoryCount = {};
    products.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        grossRevenue,
        todaySales,
        grossProfit,
        lowStockCount,
        totalTransactions: sales.length,
        totalProducts: products.length,
        categoryCount
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate dashboard metrics', details: err.message });
  }
});

// GET /api/reports/valuation - Inventory asset valuation
router.get('/valuation', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    let totalCostVal = 0;
    let totalRetailVal = 0;

    products.forEach(p => {
      totalCostVal += (p.cost || 0) * (p.stock || 0);
      totalRetailVal += (p.price || 0) * (p.stock || 0);
    });

    const unrealizedProfit = Math.max(0, totalRetailVal - totalCostVal);

    res.json({
      success: true,
      data: {
        totalCostVal,
        totalRetailVal,
        unrealizedProfit,
        productCount: products.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate inventory valuation', details: err.message });
  }
});

// GET /api/reports/velocity - Top performing products
router.get('/velocity', verifyToken, async (req, res) => {
  try {
    const sales = await Sale.find();
    const productStats = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const id = item.productId;
        if (!productStats[id]) {
          productStats[id] = {
            productId: id,
            name: item.name,
            sku: item.sku,
            unitsSold: 0,
            revenue: 0,
            profit: 0
          };
        }
        productStats[id].unitsSold += item.qty;
        productStats[id].revenue += item.total;
        const cost = item.cost || (item.price * 0.6);
        productStats[id].profit += (item.price - cost) * item.qty;
      });
    });

    const ranking = Object.values(productStats).sort((a, b) => b.revenue - a.revenue);
    res.json({ success: true, count: ranking.length, data: ranking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate velocity report', details: err.message });
  }
});

module.exports = router;
