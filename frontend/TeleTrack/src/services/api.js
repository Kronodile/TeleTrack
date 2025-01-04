import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

// frontend/TeleTrack/src/services/api.js
export const authService = {
    login: async (credentials) => {
      try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    // Add register method
    register: async (userData) => {
      try {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    }
  };
export const productService = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
  getCategories: () => api.get('/products/categories'),
  search: (query) => api.get(`/products/search?q=${query}`),
};

export const supplierService = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
  getOrderStatus: (id) => api.get(`/suppliers/${id}/order-status`),
  getOrders: (id) => api.get(`/suppliers/${id}/orders`),
  createOrder: (id, data) => api.post(`/suppliers/${id}/orders`, data),
  updateOrderStatus: (id, orderId, status) => 
    api.put(`/suppliers/${id}/orders/${orderId}`, { status }),
};

export const transactionService = {
  create: (data) => api.post('/transactions', data),
  getAll: () => api.get('/transactions'),
  getByProduct: (productId) => api.get(`/transactions/product/${productId}`),
};

export const alertService = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
  getLowStockAlerts: () => api.get('/alerts/low-stock'),
  getOrderAlerts: () => api.get('/alerts/orders'),
};

export const userService = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getCurrentUser: () => api.get('/users/me'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getLowStockCount: () => api.get('/dashboard/low-stock-count'),
  getPendingOrders: () => api.get('/dashboard/pending-orders'),
  getRecentTransactions: () => api.get('/dashboard/recent-transactions'),
};

export default api;