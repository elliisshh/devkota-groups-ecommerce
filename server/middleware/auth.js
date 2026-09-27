const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const router = express.Router();
const secret = () => process.env.JWT_SECRET || 'secret_key';
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, country: user.country });

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    if (String(req.user.userId) !== req.params.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (String(req.user.userId) !== req.params.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const allowed = ['name', 'phone', 'address', 'city', 'state', 'zipCode', 'country', 'profileImage', 'role'];
    const updates = {};

    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (req.user.role !== 'admin' && updates.role) delete updates.role;

    if (!Object.keys(updates).length) return res.status(400).json({ message: 'No valid updates provided' });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    const token = jwt.sign({ userId: user._id, role: user.role }, secret(), { expiresIn: '7d' });
    res.json({ user: publicUser(user), token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
