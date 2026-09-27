import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Orders = () => {
  const user = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return setLoading(false);

    axios.get(`/api/orders/user/${user.id}`)
      .then(({ data }) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return <div className="container py-12 text-center"><h1 className="text-3xl font-bold">Please log in to view orders</h1></div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders yet.</p> : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-bold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-blue-600">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold">${Number(order.total || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b pb-2">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
