import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/book/${book._id}`} className="block">
        <div className="h-64 overflow-hidden">
          <img
            src={book.bookImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-1 truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-gray-500 mb-3">by {book.author}</p>
          <p className="text-2xl font-bold text-teal-600">
            ${book.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;