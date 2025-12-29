import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Component Imports ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// --- Page Imports ---
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CreateBookPage from './pages/CreateBookPage';
import BookDetailsPage from './pages/BookDetailsPage';
import EditBookPage from './pages/EditBookPage';
import AdminDashboardPage from './pages/AdminDashboardPage';


function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* This was the line with the typo */}
          <Route path="/login" element={<LoginPage />} /> 
          
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* --- Protected Customer Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Route>
          
          {/* --- Protected Admin Routes --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/create-book" element={<CreateBookPage />} />
            <Route path="/edit-book/:id" element={<EditBookPage />} />
          </Route>
          
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500">
          © 2025 Bookstore Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;