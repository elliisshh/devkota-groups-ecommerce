const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/:id', auth, async (req, res) => { try { if (String(req.user.userId) !== req.params.id) return res.status(403).json({ message: 'Forbidden' }); const user = await User.findById(req.params.id).select('-password'); if (!user) return res.status(404).json({ message: 'User not found' }); res.json(user); } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); } });
router.put('/:id', auth, async (req, res) => { try { if (String(req.user.userId) !== req.params.id) return res.status(403).json({ message: 'Forbidden' }); const allowed = ['name', 'phone', 'address', 'city', 'state', 'zipCode', 'country']; const updates = Object.fromEntries(allowed.filter(key => req.body[key] !== undefined).map(key => [key, req.body[key]])); updates.updatedAt = new Date(); const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password'); res.json(user); } catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); } });
module.exports = router;
