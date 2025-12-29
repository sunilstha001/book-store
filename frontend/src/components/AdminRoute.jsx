import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

const AdminRoute = () => {
  const { user, isAdmin } = useAuthStore();

  // User must be logged in AND be an admin
  return user && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;