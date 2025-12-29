import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import api from '../api';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, user } = useAuthStore();
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }
    
    // Format cart items for the backend
    const orderItems = cart.map(item => ({
      bookId: item._id,
      title: item.title,
      qty: item.qty,
      price: item.price,
    }));

    try {
      await api.post('/orders', {
        orderItems,
        totalPrice: totalPrice.toFixed(2),
      });
      alert('Order placed successfully!');
      clearCart();
      navigate('/orders'); 
    } catch (err) {
      alert('Failed to place order');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center space-x-4">
                <img src={item.bookImage} alt={item.title} className="w-16 h-20 object-cover rounded" />
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} x {item.qty}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-lg font-bold">${(item.price * item.qty).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end items-center mt-6">
            <span className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handlePlaceOrder}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;