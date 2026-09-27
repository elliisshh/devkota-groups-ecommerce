const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const secret = () => process.env.JWT_SECRET || 'secret_key';
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
      return res.status(400).json({ message: 'Name, email, and a password of at least 8 characters are required' });
    }

    if (!['customer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Unsupported user role' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, secret(), { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', token, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(req.body.password || ''))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret(), { expiresIn: '7d' });
    res.json({ message: 'Logged in successfully', token, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
