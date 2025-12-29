import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuthStore } from '../hooks/useAuthStore';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const addToCart = useAuthStore((state) => state.addToCart);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        setError('Failed to fetch book');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToFavorites = async () => { 
    if (!user) {
      alert('Please login to add to favorites');
      navigate('/login');
      return;
    }
    try {
      await api.post('/users/favorites', { bookId: id });
      alert('Added to favorites!');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to favorites');
    }
  }
  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book);
    alert(`${book.title} added to cart!`);
  }
  const handleDelete = async () => {
    if (!isAdmin) {
        alert('You are not authorized to delete books');
        return;
    }
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        alert('Book deleted successfully');
        navigate('/');
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  }

  if (loading) return <p className="text-center text-lg mt-10">Loading book...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!book) return <p className="text-center text-lg mt-10">Book not found.</p>;

  return (

    <div className="container mx-auto max-w-4xl p-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          
          <img
            src={book.bookImage}
            alt={book.title}
            className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-md"
          />
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-2xl text-gray-600 mb-4">by {book.author}</p>
            <p className="text-3xl font-bold text-teal-600 mb-6"> 
              ${book.price.toFixed(2)}
            </p>
            
            {user && isAdmin ? (
              <div className="mt-8 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800">Admin Actions</h3>
                <div className="flex space-x-3 mt-2">
                  <Link 
                    to={`/edit-book/${book._id}`} 
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition" 
                  >
                    Edit Book
                  </Link>
                  <button 
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete Book
                  </button>
                </div>
              </div>
            ) : (
    
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleAddToFavorites}
                  className="w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300 flex items-center justify-center shadow-lg" // 👈 THEME CHANGE
                >
                  <span className="mr-2">❤️</span> Add to Favorites
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition duration-300 shadow-lg" // 👈 THEME CHANGE
                >
                  Add to Cart
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;