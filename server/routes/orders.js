const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { items = [], shippingAddress, paymentMethod = 'cash_on_delivery' } = req.body;
    if (!items.length || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) return res.status(400).json({ message: 'Items and a complete shipping address are required' });
    const orderItems = [];
    let subtotal = 0;
    for (const requested of items) {
      const quantity = Number(requested.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Invalid item quantity' });
      const product = await Product.findOne({ _id: requested.productId, active: true });
      if (!product || product.stock < quantity) return res.status(400).json({ message: `Product unavailable: ${requested.productName || requested.productId}` });
      orderItems.push({ productId: product._id, productName: product.name, quantity, price: product.price, image: product.thumbnail });
      subtotal += product.price * quantity;
    }
    const shippingCost = subtotal >= 50 ? 0 : 5;
    const tax = Number((subtotal * 0.1).toFixed(2));
    const total = Number((subtotal + shippingCost + tax).toFixed(2));
    const order = await Order.create({ userId: req.user.userId, items: orderItems, shippingAddress, subtotal, shippingCost, tax, total, paymentMethod, orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}` });
    for (const item of orderItems) await Product.updateOne({ _id: item.productId, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } });
    res.status(201).json({ message: 'Order created', order });
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});
router.get('/user/:userId', auth, async (req, res) => { try { if (String(req.user.userId) !== req.params.userId) return res.status(403).json({ message: 'Forbidden' }); res.json(await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })); } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); } });
module.exports = router;
