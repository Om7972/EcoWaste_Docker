import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: FormData) => api.put('/auth/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Complaint endpoints
export const complaintAPI = {
  getAll: (params?: Record<string, string>) => api.get('/complaints', { params }),
  getById: (id: string) => api.get(`/complaints/${id}`),
  create: (data: FormData) => api.post('/complaints', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: Record<string, unknown>) => api.put(`/complaints/${id}`, data),
  delete: (id: string) => api.delete(`/complaints/${id}`),
  getMyComplaints: () => api.get('/complaints/my'),
};

// Waste report endpoints
export const wasteAPI = {
  predict: (data: FormData) => api.post('/waste/predict', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHistory: () => api.get('/waste/history'),
  getStats: () => api.get('/waste/stats'),
};

// Recycling center endpoints
export const recyclingAPI = {
  getAll: (params?: Record<string, string>) => api.get('/recycling-centers', { params }),
  getById: (id: string) => api.get(`/recycling-centers/${id}`),
  getNearby: (lat: number, lng: number, radius?: number) =>
    api.get('/recycling-centers/nearby', { params: { lat, lng, radius } }),
};

// Dashboard/stats endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAdminStats: () => api.get('/dashboard/admin-stats'),
  getAnalytics: (period?: string) => api.get('/dashboard/analytics', { params: { period } }),
};

// Route endpoints (admin)
export const routeAPI = {
  getAll: () => api.get('/routes'),
  getById: (id: string) => api.get(`/routes/${id}`),
  create: (data: Record<string, unknown>) => api.post('/routes', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/routes/${id}`, data),
  optimize: (id: string) => api.post(`/routes/${id}/optimize`),
};

// Notification endpoints
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Reward endpoints
export const rewardAPI = {
  getPoints: () => api.get('/rewards/points'),
  getLeaderboard: () => api.get('/rewards/leaderboard'),
  redeem: (data: { points: number; reward: string }) => api.post('/rewards/redeem', data),
};

export default api;
