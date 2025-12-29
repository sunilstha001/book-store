import React from 'react';
import { Link } from 'react-router-dom';

//const heroBgImage = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjUyOXwwfDF8c2VhcmNofDEwfHxsaWJyYXJ5fGVufDB8fDB8fDE3MzA0Mzk0MDF8MA';
const heroBgImage = "https://images.unsplash.com/photo-1709385283538-d3258a461032?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGJvb2slMjBzdG9yZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600";
const Hero = () => {
  return (
    <div 
      className="relative h-[calc(100vh-64px)] min-h-[700px] flex items-center justify-center text-center text-white"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 p-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Find Your Next Adventure
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Explore thousands of titles, from timeless classics to modern masterpieces. 
          Your new favorite book is just a click away.
        </p>
        <Link 
          to="/signup" 
          className="bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg transform hover:scale-105" // 👈 THEME CHANGE
        >
          Start Reading Now
        </Link>
      </div>
    </div>
  );
};

export default Hero;