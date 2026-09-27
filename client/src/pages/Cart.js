import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity > 0) {
      dispatch({
        type: 'UPDATE_CART',
        payload: { _id: productId, quantity }
      });
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Quantity</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Link to={`/product/${item._id}`} className="text-blue-600 hover:underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
