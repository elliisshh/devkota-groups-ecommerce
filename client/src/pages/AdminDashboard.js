import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const AdminDashboard = () => {
  const user = useSelector(state => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    axios.get('/api/products').then(({ data }) => setProducts(data.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="text-center py-12">Please log in to access admin panel</div>;

  const myProducts = products.filter(p => String(p.seller?._id) === String(user.id));

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Seller Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 p-6 rounded shadow"><p className="text-gray-600">Total Products</p><p className="text-3xl font-bold text-blue-600">{myProducts.length}</p></div>
          <div className="bg-green-100 p-6 rounded shadow"><p className="text-gray-600">Total Stock</p><p className="text-3xl font-bold text-green-600">{myProducts.reduce((sum, p) => sum + p.stock, 0)}</p></div>
          <div className="bg-orange-100 p-6 rounded shadow"><p className="text-gray-600">Total Value</p><p className="text-3xl font-bold text-orange-600">${myProducts.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}</p></div>
        </div>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left">Product</th><th className="px-4 py-2 text-left">Price</th><th className="px-4 py-2 text-left">Stock</th><th className="px-4 py-2 text-left">Rating</th></tr></thead>
            <tbody>{loading ? <tr><td className="px-4 py-2" colSpan="4">Loading...</td></tr> : !myProducts.length ? <tr><td className="px-4 py-2" colSpan="4">No products yet</td></tr> : myProducts.map(p => <tr key={p._id} className="border-t"><td className="px-4 py-2">{p.name}</td><td className="px-4 py-2">${p.price}</td><td className="px-4 py-2">{p.stock}</td><td className="px-4 py-2">{p.rating} ⭐</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
