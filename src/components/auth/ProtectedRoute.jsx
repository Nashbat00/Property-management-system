import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requireRole && user.role !== requireRole) {
    const fallback = user.role === 'manager' ? '/dashboard/manager' : '/dashboard/resident';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
