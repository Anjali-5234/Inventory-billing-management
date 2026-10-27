import { apiClient } from './api';

export const authService = {
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  }
};
