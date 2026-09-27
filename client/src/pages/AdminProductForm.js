import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const AdminProductForm = () => {
  const user = useSelector(state => state.user);
  const [form, setForm] = useState({ name: '', description: '', price: '', originalPrice: '', category: 'Electronics', thumbnail: '', stock: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="text-center py-12">Please log in to add products</div>;

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/products', form);
      setMessage('Product added successfully!');
      setForm({ name: '', description: '', price: '', originalPrice: '', category: 'Electronics', thumbnail: '', stock: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white rounded shadow p-8">
          <h1 className="text-3xl font-bold mb-6">Add Product</h1>
          {message && <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
          <form onSubmit={submit} className="space-y-4">
            <input name="name" placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded" required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded" rows="3" />
            <div className="grid md:grid-cols-2 gap-4">
              <input type="number" name="price" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="px-4 py-2 border rounded" required />
              <input type="number" name="originalPrice" placeholder="Original price (optional)" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="px-4 py-2 border rounded" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-4 py-2 border rounded">
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Garden</option>
                <option>Sports</option>
              </select>
              <input type="number" name="stock" placeholder="Stock quantity" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="px-4 py-2 border rounded" required />
            </div>
            <input name="thumbnail" placeholder="Thumbnail image URL" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="w-full px-4 py-2 border rounded" />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50">{loading ? 'Adding...' : 'Add Product'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
