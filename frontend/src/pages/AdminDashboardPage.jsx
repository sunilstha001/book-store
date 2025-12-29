import React, { useState, useEffect } from 'react';
import api from '../api';
import socket from '../socket';

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Fetch all orders on load
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/all');
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();

    // 2. Listen for new orders
    const handleNewOrder = (newOrder) => {
      // Add the new order to the top of the list in real-time
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    };
    socket.on('new_order', handleNewOrder);
    
    // 3. Listen for status updates from other admins
    const handleOrderUpdate = (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    };
    socket.on('admin_order_updated', handleOrderUpdate);

    // 4. Clean up listeners
    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('admin_order_updated', handleOrderUpdate);
    };
  }, []);

  // 5. Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistic UI update: update state immediately
      setOrders(prev => 
        prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
      
      // Send update to backend
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      setError('Failed to update status');
      // Revert UI if update fails (simplified for now)
    }
  };

  if (loading) return <p className="text-center text-lg mt-10">Loading all orders...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard: Manage Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Order ID: <span className="text-gray-600 text-sm">{order._id}</span></h3>
                  
                  {/* --- THIS IS THE FIX --- */}
                  <div className="flex items-center space-x-2 mt-1">
                    <img 
                      src={order.user.profilePic || 'https://via.placeholder.com/24'} 
                      alt={order.user.username}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-700 font-medium">Placed by: {order.user.username}</span>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
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
    
              <div className="mt-4 border-t pt-4 flex items-center space-x-3">
                 <label htmlFor={`status-${order._id}`} className="font-semibold">Update Status:</label>
                 <select 
                   id={`status-${order._id}`}
                   value={order.status}
                   onChange={(e) => handleStatusChange(order._id, e.target.value)}
                   className="p-2 border rounded-lg bg-gray-50"
                 >
                   <option value="Pending">Pending</option>
                   <option value="Shipped">Shipped</option>
                   <option value="Delivered">Delivered</option>
                 </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;