const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  registerOrganization,
  getOrganizationInfo,
  addVehicle,
  getVehicles,
  addDriver,
  getDrivers,
  addExpense,
  getExpenses,
  getKPIDashboard,
  getAIOperationalForecast,
  triggerAutomation
} = require('../controllers/saasController');

// Multi-Tenant registration & settings (registration is public to allow scaling, info is protected)
router.post('/tenant/register', registerOrganization);
router.get('/tenant/info', protect, getOrganizationInfo);

// Fleet Operations
router.post('/fleet/vehicles', protect, addVehicle);
router.get('/fleet/vehicles', protect, getVehicles);
router.post('/fleet/drivers', protect, addDriver);
router.get('/fleet/drivers', protect, getDrivers);

// Expense tracker
router.post('/expenses', protect, addExpense);
router.get('/expenses', protect, getExpenses);

// Analytics & AI Forecasting
router.get('/analytics/kpis', protect, getKPIDashboard);
router.get('/analytics/ai-forecast', protect, getAIOperationalForecast);

// SLA Escalation & Automation
router.post('/automation/trigger', protect, triggerAutomation);

module.exports = router;
