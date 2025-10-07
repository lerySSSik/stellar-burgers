import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsAuthenticated, getAuthLoading } from '../../services/selectors';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isLoading = useSelector(getAuthLoading);

  if (isLoading) {
    return <div>Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
