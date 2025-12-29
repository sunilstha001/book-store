import React, { useState, useEffect } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';
import Hero from '../components/Hero'; 
import socket from '../socket';
import { useAuthStore } from '../hooks/useAuthStore';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const { user, isAdmin } = useAuthStore(); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/books');
        setBooks(res.data);
      } catch (err) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
    
    if (user && isAdmin) {
      socket.on('new_order', (order) => {
        setNotification(`Admin: New order #${order._id} has been placed!`);
        setTimeout(() => setNotification(''), 5000);
      });
    }
    
    return () => {
      socket.off('new_order');
    };
  }, [user, isAdmin]);

  return (
    <div>
      {!user ? (
        // 1. If user is a GUEST, show the full promo
        <Hero />
      ) : (
        // 2. If user is LOGGED IN, show a welcome message
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.username}!
          </h1>
        </div>
      )}
  

      <div className="container mx-auto px-4 py-12">
        {notification && (
          <div className="bg-green-500 text-white p-3 rounded-lg text-center mb-8">
            {notification}
          </div>
        )}
        
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
          New Arrivals
        </h2>
        
        {loading ? (
          <p className="text-center text-lg">Loading books...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;