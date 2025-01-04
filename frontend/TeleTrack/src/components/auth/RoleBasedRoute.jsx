import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RoleBasedRoute({ children, requiredRole }) {
    const { user, hasPermission } = useAuth();
    const location = useLocation();
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  
    if (!hasPermission(requiredRole)) {
      return <Navigate to="/" replace />;
    }
  
    return children;
}

export default RoleBasedRoute;