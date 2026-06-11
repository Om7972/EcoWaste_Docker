import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiHome, FiFileText, FiMapPin, FiBarChart2, FiAward, FiBell, FiSettings, FiLogOut, FiMenu, FiX, FiTrendingUp, FiTrash2, FiCheckCircle, FiClock, FiPlus, FiCamera } from 'react-icons/fi';
import { FaRecycle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const wasteData = [
  { month: 'Jan', plastic: 40, paper: 24, glass: 20, organic: 30 },
  { month: 'Feb', plastic: 30, paper: 28, glass: 22, organic: 35 },
  { month: 'Mar', plastic: 35, paper: 32, glass: 18, organic: 40 },
  { month: 'Apr', plastic: 45, paper: 26, glass: 25, organic: 28 },
  { month: 'May', plastic: 50, paper: 30, glass: 20, organic: 32 },
  { month: 'Jun', plastic: 38, paper: 34, glass: 28, organic: 38 },
];

const pieData = [
  { name: 'Plastic', value: 35, color: '#8b5cf6' },
  { name: 'Paper', value: 25, color: '#3b82f6' },
  { name: 'Glass', value: 15, color: '#06b6d4' },
  { name: 'Organic', value: 20, color: '#22c55e' },
  { name: 'Metal', value: 5, color: '#f59e0b' },
];

const trendData = [
  { day: 'Mon', complaints: 12, resolved: 10 },
  { day: 'Tue', complaints: 19, resolved: 15 },
  { day: 'Wed', complaints: 8, resolved: 8 },
  { day: 'Thu', complaints: 15, resolved: 12 },
  { day: 'Fri', complaints: 22, resolved: 18 },
  { day: 'Sat', complaints: 10, resolved: 9 },
  { day: 'Sun', complaints: 5, resolved: 5 },
];

const recentComplaints = [
  { id: 1, title: 'Overflowing bin at Park Ave', status: 'pending', priority: 'high', time: '2h ago' },
  { id: 2, title: 'Illegal dumping near river', status: 'in_progress', priority: 'critical', time: '5h ago' },
  { id: 3, title: 'Missed pickup on Elm Street', status: 'resolved', priority: 'medium', time: '1d ago' },
  { id: 4, title: 'Broken recycling bin', status: 'pending', priority: 'low', time: '2d ago' },
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const stats = [
    { label: 'Total Reports', value: '1,247', change: '+12%', icon: FiFileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Resolved', value: '1,089', change: '+8%', icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Pending', value: '158', change: '-5%', icon: FiClock, color: 'from-amber-500 to-orange-500' },
    { label: 'Reward Points', value: user?.rewardPoints?.toString() || '2,450', change: '+320', icon: FiAward, color: 'from-purple-500 to-pink-500' },
  ];

  const sidebarLinks = [
    { icon: FiHome, label: 'Overview', active: true },
    { icon: FiFileText, label: 'Complaints' },
    { icon: FiCamera, label: 'AI Scanner' },
    { icon: FiMapPin, label: 'Map' },
    { icon: FiBarChart2, label: 'Analytics' },
    { icon: FiAward, label: 'Rewards' },
    { icon: FiBell, label: 'Notifications' },
    { icon: FiSettings, label: 'Settings' },
  ];

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };

  const priorityColor: Record<string, string> = {
    low: 'text-gray-500', medium: 'text-amber-500', high: 'text-orange-500', critical: 'text-red-500',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex pt-16 md:pt-20">
      {/* Sidebar */}
      <aside className={`fixed md:sticky top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between md:hidden mb-4">
            <span className="font-bold text-gray-900 dark:text-white">Menu</span>
            <button onClick={() => setSidebarOpen(false)} title="Close menu" aria-label="Close menu"><FiX size={20} /></button>
          </div>
          {/* User Card */}
          <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'citizen'}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => (
              <button key={link.label} className={link.active ? 'sidebar-link-active w-full' : 'sidebar-link w-full'}>
                <link.icon size={18} />{link.label}
              </button>
            ))}
          </nav>
          <button onClick={logout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <FiLogOut size={18} />Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => setSidebarOpen(true)} title="Open menu" aria-label="Open menu" className="md:hidden p-2 -ml-2 mb-2"><FiMenu size={24} /></button>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
              {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'User'} 👋</p>
          </div>
          <Link to="/dashboard" className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus size={16} />New Report
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  <FiTrendingUp className="inline mr-1" size={14} />{stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Waste Collection Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="plastic" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paper" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="glass" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="organic" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Waste Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full color-dot" data-color={item.color} style={{ ['--dot-color' as string]: item.color }} aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trends & Complaints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Weekly Complaint Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area type="monotone" dataKey="complaints" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Complaints */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card-solid p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Complaints</h3>
              <Link to="/dashboard" className="text-sm text-primary-500 font-medium">View all</Link>
            </div>
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${priorityColor[c.priority]} bg-current`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.title}</p>
                      <p className="text-xs text-gray-500">{c.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
