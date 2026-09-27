const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const router = express.Router();

router.use(auth, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, activeProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ active: true })
    ]);

    const revenue = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
