import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

interface Props {
  children: React.ReactNode;
  roles?: Array<'PATIENT' | 'DOCTOR' | 'PSYCHOLOGIST' | 'ADMIN'>;
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to appropriate dashboard
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'DOCTOR' || user.role === 'PSYCHOLOGIST') return <Navigate to="/doctor/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
