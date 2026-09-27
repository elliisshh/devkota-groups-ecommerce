const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const carts = new Map();
router.get('/:userId', (req, res) => res.json(carts.get(req.params.userId) || []));
router.post('/:userId/add', async (req, res) => { try { const product = await Product.findById(req.body.productId); if (!product) return res.status(404).json({ message: 'Product not found' }); const cart = carts.get(req.params.userId) || []; const existing = cart.find(item => String(item.productId) === String(product._id)); if (existing) existing.quantity += Number(req.body.quantity || 1); else cart.push({ productId: product._id, name: product.name, price: product.price, image: product.thumbnail, quantity: Number(req.body.quantity || 1) }); carts.set(req.params.userId, cart); res.json(cart); } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); } });
router.delete('/:userId/remove/:productId', (req, res) => { const cart = (carts.get(req.params.userId) || []).filter(item => String(item.productId) !== req.params.productId); carts.set(req.params.userId, cart); res.json(cart); });
module.exports = router;
