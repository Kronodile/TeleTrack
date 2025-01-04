import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import {
  Login,
  Register,
  Dashboard,
  Products,
  Suppliers,
  Users,
} from './pages';

import { ProtectedRoute, RoleBasedRoute } from './components/auth';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          <Route path="/register" element={
            <AuthLayout>
              <Register />
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
            {/* Redirect /dashboard to root */}
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;