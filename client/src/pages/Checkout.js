import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', street: '', city: '', state: '', zipCode: '', country: '', phone: '' });
  const [message, setMessage] = useState('');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await axios.post('/api/orders', { userId: user.id, items: cart.map(({ _id, name, quantity, price, thumbnail }) => ({ productId: _id, productName: name, quantity, price, image: thumbnail })), shippingAddress: form, subtotal, tax, shippingCost: 0, total, paymentMethod: 'cash_on_delivery' });
      window.localStorage.removeItem('cart');
      window.location.href = '/orders';
    } catch (err) { setMessage(err.response?.data?.message || 'Unable to place order.'); }
  };
  if (!cart.length) return <div className="container py-12 text-center"><h1 className="text-3xl font-bold mb-4">Your cart is empty</h1><button onClick={() => navigate('/products')} className="text-blue-600">Continue shopping</button></div>;
  return <div className="container py-12 max-w-4xl"><h1 className="text-3xl font-bold mb-8">Checkout</h1>{message && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</p>}<form onSubmit={submit} className="grid md:grid-cols-2 gap-8"><div className="bg-white p-6 rounded shadow space-y-4"><h2 className="text-xl font-bold">Shipping address</h2>{Object.keys(form).map(key => <input key={key} name={key} value={form[key]} onChange={change} required={key !== 'state'} placeholder={key.replace(/([A-Z])/g, ' $1')} className="w-full border rounded px-3 py-2" />)}<button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold">Place order (cash on delivery)</button></div><div className="bg-white p-6 rounded shadow h-fit"><h2 className="text-xl font-bold mb-4">Order summary</h2>{cart.map(item => <div key={item._id} className="flex justify-between py-2"><span>{item.name} × {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}<hr className="my-3" /><div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div><div className="flex justify-between font-bold text-lg mt-3"><span>Total</span><span>${total.toFixed(2)}</span></div></div></form></div>;
};
export default Checkout;
