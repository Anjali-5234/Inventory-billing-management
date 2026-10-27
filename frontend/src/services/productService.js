import { apiClient } from './api';

export const productService = {
  getAll: async () => apiClient.get('/products'),
  create: async (data) => apiClient.post('/products', data)
};
