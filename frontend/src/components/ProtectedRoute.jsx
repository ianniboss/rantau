import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12" data-testid="auth-loading">
        <div className="skeleton h-8 w-1/2 rounded" />
        <div className="skeleton mt-6 h-64 w-full rounded-xl" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};
