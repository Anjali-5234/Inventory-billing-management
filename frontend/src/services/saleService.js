import { apiClient } from './api';

export const saleService = {
  checkout: async (payload) => apiClient.post('/pos/checkout', payload),
  getReports: async () => apiClient.get('/reports/dashboard')
};
