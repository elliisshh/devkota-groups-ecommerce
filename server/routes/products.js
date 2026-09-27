const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, sort = '-createdAt', page = 1, limit = 20 } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    const products = await Product.find(filter).populate('seller', 'name').sort(sort).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!q || q.length < 2) return res.status(400).json({ message: 'Query must be at least 2 characters' });
    const filter = { active: true, $text: { $search: q } };
    if (category) filter.category = category;
    const products = await Product.find(filter, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }).limit(20);
    res.json(products);
  } catch (error) { res.status(500).json({ message: 'Search error', error: error.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true }).populate('seller', 'name email').populate('reviews.userId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, thumbnail, images, stock, tags } = req.body;
    if (!name?.trim() || !price || !category?.trim() || stock == null) return res.status(400).json({ message: 'Name, price, category, and stock are required' });
    if (price < 0) return res.status(400).json({ message: 'Price cannot be negative' });
    const product = await Product.create({ name: name.trim(), description: description?.trim(), price: Number(price), originalPrice: originalPrice ? Number(originalPrice) : undefined, category: category.trim(), thumbnail, images: images || [], stock: Number(stock), seller: req.user.userId, tags: tags || [] });
    res.status(201).json(product);
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (String(product.seller) !== String(req.user.userId)) return res.status(403).json({ message: 'Forbidden' });
    const allowed = ['name', 'description', 'price', 'originalPrice', 'category', 'thumbnail', 'images', 'stock', 'tags', 'active'];
    Object.keys(req.body).filter(key => allowed.includes(key)).forEach(key => { product[key] = req.body[key]; });
    product.updatedAt = new Date();
    await product.save();
    res.json(product);
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.reviews.push({ userId: req.user.userId, rating: Number(rating), comment: comment?.trim() });
    product.rating = (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1);
    await product.save();
    res.json(product);
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (String(product.seller) !== String(req.user.userId)) return res.status(403).json({ message: 'Forbidden' });
    await Product.updateOne({ _id: req.params.id }, { active: false });
    res.json({ message: 'Product deactivated' });
  } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

module.exports = router;
