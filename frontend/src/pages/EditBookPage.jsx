import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const EditBookPage = () => {
  const { id } = useParams(); // Get book ID from URL
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [bookImage, setBookImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setPageLoading(true);
        const res = await api.get(`/books/${id}`);
        const book = res.data;
        setTitle(book.title);
        setAuthor(book.author);
        setPrice(book.price);
        setCurrentImageUrl(book.bookImage);
      } catch (err) {
        setError('Failed to fetch book data');
      } finally {
        setPageLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('price', price);
    if (bookImage) {
      formData.append('bookImage', bookImage); 
    }

    try {
      await api.put(`/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Book updated successfully!');
      navigate(`/book/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <p className="text-center text-lg mt-10">Loading book data...</p>

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Book</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Image</label>
          {currentImageUrl ? (
            <img src={currentImageUrl} alt="Current cover" className="w-32 h-auto rounded" />
          ) : (
            <p>No image</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
         <div className="mb-4">
          <label className="block text-gray-700 mb-2">Author</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={author}
            onChange={(e) => setAuthor(e.taget.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload New Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700"
            onChange={(e) => setBookImage(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Book'}
        </button>
      </form>
    </div>
  );
};

export default EditBookPage;