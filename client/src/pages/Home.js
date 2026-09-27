import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', street: '', city: '', state: '', zipCode: '', country: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shippingCost = subtotal >= 50 ? 0 : 5;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + shippingCost + tax).toFixed(2));

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);
    setMessage('');

    try {
      const { data } = await axios.post('/api/orders/checkout', {
        paymentMethod,
        items: cart.map(item => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.thumbnail || item.images?.[0]
        })),
        shippingAddress: {
          ...form,
          name: form.name || user.name
        },
        subtotal,
        shippingCost,
        tax,
        total
      });

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      localStorage.removeItem('cart');
      window.location.href = '/orders';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button onClick={() => navigate('/products')} className="text-blue-600">Continue shopping</button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {message && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{message}</p>}

      <form onSubmit={submit} className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Shipping Information</h2>

          <input name="name" value={form.name} onChange={change} placeholder="Full Name" className="w-full border rounded px-3 py-2" required />
          <input name="street" value={form.street} onChange={change} placeholder="Street Address" className="w-full border rounded px-3 py-2" required />
          <div className="grid md:grid-cols-2 gap-4">
            <input name="city" value={form.city} onChange={change} placeholder="City" className="border rounded px-3 py-2" required />
            <input name="state" value={form.state} onChange={change} placeholder="State" className="border rounded px-3 py-2" required />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="zipCode" value={form.zipCode} onChange={change} placeholder="ZIP Code" className="border rounded px-3 py-2" required />
            <input name="country" value={form.country} onChange={change} placeholder="Country" className="border rounded px-3 py-2" required />
          </div>
          <input name="phone" value={form.phone} onChange={change} placeholder="Phone" className="w-full border rounded px-3 py-2" required />

          <div>
            <label className="block font-medium mb-2">Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="stripe">Stripe (ready for integration)</option>
            </select>
          </div>

          <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold disabled:opacity-60">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {cart.map(item => (
            <div key={item._id} className="flex justify-between py-2 border-b">
              <span>{item.name} × {item.quantity}</span>
              <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
            </div>
          ))}

          <div className="space-y-2 mt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
