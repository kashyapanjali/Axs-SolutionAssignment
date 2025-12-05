const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Get dashboard stats
router.get('/', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Today's revenue
    const todayRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].total : 0;

    // Low stock products (stock < 10)
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 10 },
      status: 'Active'
    });

    // Total revenue (all time, excluding cancelled)
    const totalRevenueData = await Order.aggregate([
      {
        $match: { status: { $ne: 'Cancelled' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);
    const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Pending orders (New + Processing)
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['New', 'Processing'] }
    });

    res.json({
      success: true,
      stats: {
        todayOrders,
        todayRevenue: parseFloat(todayRevenue.toFixed(2)),
        lowStockProducts,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        pendingOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

