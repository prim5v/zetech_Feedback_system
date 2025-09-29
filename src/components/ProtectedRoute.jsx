import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute = ({
  children,
  requiredRole
}) => {
  const {
    user,
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;