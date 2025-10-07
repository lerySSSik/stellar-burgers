import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsAuthenticated, getAuthLoading } from '../../services/selectors';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isLoading = useSelector(getAuthLoading);

  if (isLoading) {
    return <div>Проверка авторизации...</div>;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
