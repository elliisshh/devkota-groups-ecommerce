const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  category: { type: String, required: true },
  subcategory: String,
  images: [String],
  thumbnail: String,
  stock: { type: Number, default: 0, min: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ userId: mongoose.Schema.Types.ObjectId, userName: String, rating: { type: Number, min: 1, max: 5 }, comment: String, createdAt: { type: Date, default: Date.now } }],
  tags: [String],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, active: 1 });
productSchema.index({ seller: 1, active: 1 });
module.exports = mongoose.model('Product', productSchema);
