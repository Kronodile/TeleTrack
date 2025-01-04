import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    return token && role && name ? { token, role, name } : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = (userData) => {
    const { token, role, name } = userData;
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    setUser({ token, role, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setUser(null);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    const roles = {
      admin: 3,
      manager: 2,
      staff: 1
    };
    return roles[user.role] >= roles[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login,
      logout,
      hasPermission,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);