import React, { useState, useEffect } from 'react';
import api from '../api';
import socket from '../socket'; // Import socket instance

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Fetch initial orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        setOrders(res.data.reverse()); // Show newest orders first
        
        // 2. After fetching, join socket rooms for each order
        res.data.forEach(order => {
          socket.emit('join_order_room', `order_${order._id}`);
          console.log(`Joined room: order_${order._id}`);
        });

      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();


    const handleStatusUpdate = (update) => {
      console.log('Socket update received:', update);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === update.orderId 
            ? { ...order, status: update.status } 
            : order
        )
      );
    };
    
    socket.on('order_status_update', handleStatusUpdate);
    return () => {
      socket.off('order_status_update', handleStatusUpdate);
    };
  }, []); 

  if (loading) return <p className="text-center text-lg mt-10">Loading order history...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Your Order History</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Order ID: <span className="text-gray-600 text-sm">{order._id}</span></h3>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                       order.status === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                       'bg-yellow-200 text-yellow-800'}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Items:</h4>
                {order.orderItems.map((item) => (
                  <div key={item.bookId} className="flex justify-between text-sm text-gray-700 ml-4">
                    <span>{item.title} (x{item.qty})</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
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

export default OrderHistoryPage;