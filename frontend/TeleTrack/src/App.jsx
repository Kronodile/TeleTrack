import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/products/Products';
import Suppliers from './pages/suppliers/Suppliers';
import Users from './pages/users/Users';
import Register from './pages/auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={
                <RoleBasedRoute requiredRole="staff">
                  <Products />
                </RoleBasedRoute>
              } />
              <Route path="suppliers" element={
                <RoleBasedRoute requiredRole="manager">
                  <Suppliers />
                </RoleBasedRoute>
              } />
              <Route path="users" element={
                <RoleBasedRoute requiredRole="admin">
                  <Users />
                </RoleBasedRoute>
              } />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;