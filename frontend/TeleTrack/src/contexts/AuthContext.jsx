import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);
import { authService } from "../services/api.js";

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

  const signup = async (userData)=>{
    const response  = await authService.register(userData);
    return response;
  }
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
      Admin: 3,
      Manager: 2,
      Staff: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup,
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