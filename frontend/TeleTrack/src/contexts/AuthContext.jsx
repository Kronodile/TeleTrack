import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data on mount
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName');

      if (token && role && name) {
        setUser({ token, role, name });
      }
      setLoading(false);
    };

    checkAuth();
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
    
    const roleHierarchy = {
      admin: 3,
      manager: 2,
      staff: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      hasPermission, 
      loading,
      login,
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);