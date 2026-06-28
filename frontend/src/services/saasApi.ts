import api from './api';

export const saasAPI = {
  // Tenant registration & settings
  registerTenant: (data: {
    name: string;
    city: string;
    domain?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }) => api.post('/saas/tenant/register', data),

  getTenantInfo: () =>
    api.get('/saas/tenant/info'),

  // Fleet management
  addVehicle: (data: {
    plateNumber: string;
    model: string;
    capacity: number;
    fuelType?: string;
    fuelEfficiency?: number;
  }) => api.post('/saas/fleet/vehicles', data),

  getVehicles: () =>
    api.get('/saas/fleet/vehicles'),

  addDriver: (data: {
    driverUserId: string;
    licenseNumber: string;
    assignedVehicleId?: string;
  }) => api.post('/saas/fleet/drivers', data),

  getDrivers: () =>
    api.get('/saas/fleet/drivers'),

  // Expenses management
  addExpense: (data: {
    category: string;
    amount: number;
    description?: string;
    vehicleId?: string;
  }) => api.post('/saas/expenses', data),

  getExpenses: () =>
    api.get('/saas/expenses'),

  // KPIs and Forecast analytics
  getKPIDashboard: () =>
    api.get('/saas/analytics/kpis'),

  getAIOperationalForecast: () =>
    api.get('/saas/analytics/ai-forecast'),

  // Automations & SLA trigger
  triggerAutomation: () =>
    api.post('/saas/automation/trigger'),
};
