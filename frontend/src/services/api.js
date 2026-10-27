const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async get(endpoint) {
    const token = localStorage.getItem('apex_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
  },

  async post(endpoint, data) {
    const token = localStorage.getItem('apex_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
  },

  async put(endpoint, data) {
    const token = localStorage.getItem('apex_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
  },

  async delete(endpoint) {
    const token = localStorage.getItem('apex_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
  }
};

// Specific API domain services
export const productsApi = {
  getAll: (params = '') => apiClient.get(`/products${params}`),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`)
};

export const posApi = {
  checkout: (payload) => apiClient.post('/pos/checkout', payload),
  getSales: (params = '') => apiClient.get(`/pos/sales${params}`),
  getSaleById: (id) => apiClient.get(`/pos/sales/${id}`)
};

export const customersApi = {
  getAll: (params = '') => apiClient.get(`/customers${params}`),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`)
};

export const suppliersApi = {
  getAll: (params = '') => apiClient.get(`/suppliers${params}`),
  create: (data) => apiClient.post('/suppliers', data),
  update: (id, data) => apiClient.put(`/suppliers/${id}`, data),
  delete: (id) => apiClient.delete(`/suppliers/${id}`)
};

export const stockApi = {
  getMovements: () => apiClient.get('/stock'),
  recordIn: (data) => apiClient.post('/stock/in', data),
  recordOut: (data) => apiClient.post('/stock/out', data)
};

export const reportsApi = {
  getDashboard: () => apiClient.get('/reports/dashboard'),
  getValuation: () => apiClient.get('/reports/valuation'),
  getVelocity: () => apiClient.get('/reports/velocity')
};

export const settingsApi = {
  get: () => apiClient.get('/settings'),
  update: (data) => apiClient.put('/settings', data)
};

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me')
};
