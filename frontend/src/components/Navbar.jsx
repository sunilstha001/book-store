import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import api from '../api';

const Navbar = () => {
  const { user, logout, cart, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className="block text-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 px-4 py-3 rounded-lg" // 👈 THEME CHANGE
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="text-3xl font-bold text-teal-600"> {/* 👈 THEME CHANGE */}
            Bookstore {isAdmin && <span className="text-sm text-red-500">(Admin)</span>}
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-teal-600">Home</Link> {/* 👈 THEME CHANGE */}
            
            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-600 hover:text-teal-600">Dashboard</Link> {/* 👈 THEME CHANGE */}
                    <Link to="/create-book" className="text-gray-600 hover:text-teal-600">Add Book</Link> {/* 👈 THEME CHANGE */}
                  </>
                ) : (
                  <>
                    <Link to="/favorites" className="text-gray-600 hover:text-teal-600">Favorites</Link> {/* 👈 THEME CHANGE */}
                    <Link to="/orders" className="text-gray-600 hover:text-teal-600">My Orders</Link> {/* 👈 THEME CHANGE */}
                    <Link to="/cart" className="relative text-gray-600 hover:text-teal-600"> {/* 👈 THEME CHANGE */}
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <Link to="/profile">
                  <img 
                    src={user.profilePic || 'https://via.placeholder.com/40?text=User'} 
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover transition-transform hover:scale-110"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/cart" className="relative text-gray-600 hover:text-teal-600">Cart</Link> {/* 👈 THEME CHANGE */}
                <Link to="/login" className="text-gray-600 hover:text-teal-600">Login</Link> {/* 👈 THEME CHANGE */}
                <Link to="/signup" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-300"> {/* 👈 THEME CHANGE */}
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-teal-600 focus:outline-none" // 👈 THEME CHANGE
            >
              {/* ... (SVG hamburger/close icons are fine) ... */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <>
        <div 
          className={`
            md:hidden fixed inset-0 bg-black/50 z-40
            transition-opacity duration-300
            ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsMenuOpen(false)}
        ></div>

        <div 
          className={`
            md:hidden fixed top-0 right-0 bottom-0 z-50 w-80
            bg-white shadow-2xl p-6
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-teal-600">Menu</h2> {/* 👈 THEME CHANGE */}
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="flex flex-col space-y-3">
            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <MobileNavLink to="/admin/dashboard">Dashboard</MobileNavLink>
                    <MobileNavLink to="/create-book">Add Book</MobileNavLink>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/favorites">Favorites</MobileNavLink>
                    <MobileNavLink to="/orders">My Orders</MobileNavLink>
                    <MobileNavLink to="/cart">Cart ({cartItemCount})</MobileNavLink>
                  </>
                )}
                <MobileNavLink to="/profile">Profile</MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-100 text-red-700 px-4 py-3 rounded-lg mt-2 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/cart">Cart ({cartItemCount})</MobileNavLink>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/signup">Sign Up</MobileNavLink>
              </>
            )}
          </nav>
        </div>
      </>
    </nav>
  );
};

export default Navbar;