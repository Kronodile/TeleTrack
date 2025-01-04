import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RoleBasedRoute({ children, requiredRole }) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleBasedRoute;