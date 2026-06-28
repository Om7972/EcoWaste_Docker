import api from './api';

// Smart Bin endpoints
export const smartBinAPI = {
  // Get all bins with optional filters
  getAll: (params?: Record<string, string>) =>
    api.get('/smart-bins', { params }),

  // Get single bin with full details
  getById: (id: string) =>
    api.get(`/smart-bins/${id}`),

  // Register new bin (admin only)
  register: (data: {
    name: string;
    coordinates: [number, number];
    address: string;
    zone?: string;
    binType?: string;
    capacity?: number;
  }) => api.post('/smart-bins', data),

  // Update fill level
  updateFillLevel: (id: string, fillLevel: number) =>
    api.put(`/smart-bins/${id}/fill-level`, { fillLevel }),

  // Get nearby bins
  getNearby: (lng: number, lat: number, radius?: number) =>
    api.get('/smart-bins/nearby', { params: { lng, lat, radius } }),

  // Predict overflow for a bin
  predictOverflow: (id: string) =>
    api.get(`/smart-bins/${id}/predict`),

  // Predict all overflows
  predictAll: () =>
    api.get('/smart-bins/predictions/all'),

  // Generate optimized route
  generateRoute: (options?: { zone?: string; minFillLevel?: number; maxStops?: number }) =>
    api.post('/smart-bins/routes/optimize', options),

  // Get collection routes
  getRoutes: (params?: Record<string, string>) =>
    api.get('/smart-bins/routes', { params }),

  // Get alerts
  getAlerts: (params?: Record<string, string>) =>
    api.get('/smart-bins/alerts', { params }),

  // Acknowledge alert
  acknowledgeAlert: (id: string) =>
    api.put(`/smart-bins/alerts/${id}/acknowledge`),

  // Resolve alert
  resolveAlert: (id: string) =>
    api.put(`/smart-bins/alerts/${id}/resolve`),

  // Get analytics
  getAnalytics: (period?: string) =>
    api.get('/smart-bins/analytics', { params: { period } }),

  // Get schedule
  getSchedule: (startDate?: string, endDate?: string) =>
    api.get('/smart-bins/schedule', { params: { startDate, endDate } }),

  // Get maintenance logs
  getMaintenanceLogs: (params?: Record<string, string>) =>
    api.get('/smart-bins/maintenance', { params }),

  // Create maintenance log
  createMaintenanceLog: (binId: string, data: Record<string, unknown>) =>
    api.post(`/smart-bins/${binId}/maintenance`, data),
};
