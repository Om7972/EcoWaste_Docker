import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteScanner from './pages/WasteScanner';
import RecyclingCenters from './pages/RecyclingCenters';
import Analytics from './pages/Analytics';
import About from './pages/About';
import Contact from './pages/Contact';

import CustomCursor from './components/ui/CustomCursor';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import { Complaints, Rewards, Notifications, Settings } from './pages/dashboard/DashboardPages';
import SmartBinDashboard from './pages/dashboard/SmartBinDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/recycling-centers" element={<RecyclingCenters />} />
      <Route path="/analytics" element={<Analytics />} />
    </Route>
    
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    {/* Nested Dashboard Routes */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<DashboardOverview />} />
      <Route path="complaints" element={<Complaints />} />
      <Route path="scanner" element={<WasteScanner />} />
      <Route path="map" element={<RecyclingCenters />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="rewards" element={<Rewards />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<Settings />} />
      <Route path="smart-bins" element={<SmartBinDashboard />} />
    </Route>

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <CustomCursor />
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontSize: '14px' },
        }} />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
