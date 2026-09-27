const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, items = [], shippingAddress, subtotal = 0, shippingCost = 0, tax = 0, total } = req.body;
    if (!userId || !items.length || !shippingAddress || total == null) return res.status(400).json({ message: 'User, items, address, and total are required' });
    if (!await User.exists({ _id: userId })) return res.status(400).json({ message: 'Invalid user' });
    for (const item of items) { const product = await Product.findById(item.productId); if (!product || !product.active || product.stock < item.quantity) return res.status(400).json({ message: `Product unavailable: ${item.productName || item.productId}` }); }
    const order = new Order({ userId, items, shippingAddress, subtotal, shippingCost, tax, total, orderNumber: `ORD-${Date.now()}` });
    await order.save();
    for (const item of items) await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    res.status(201).json({ message: 'Order created', order });
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});
router.get('/user/:userId', async (req, res) => { try { res.json(await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })); } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); } });
module.exports = router;
