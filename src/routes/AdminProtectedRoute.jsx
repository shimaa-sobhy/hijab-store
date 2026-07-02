import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

export default function AdminProtectedRoute() {
  const { user, profile, loading } = useAuth();

  if (loading) return <Loader fullPage />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!profile) return <Navigate to="/admin/login" replace />;
  if (profile.role !== 'admin') return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
