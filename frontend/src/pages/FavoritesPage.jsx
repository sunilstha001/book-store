import React, { useState, useEffect } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/favorites');
        setFavorites(res.data);
      } catch (err) {
        setError('Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center text-lg mt-10">Loading favorites...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 px-6 mt-6">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">You have no favorites yet.</p>
      ) : (
        <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;