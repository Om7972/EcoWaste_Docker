import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';

const monthlyData = [
  { month: 'Jan', collected: 450, recycled: 320, complaints: 45 },
  { month: 'Feb', collected: 520, recycled: 380, complaints: 38 },
  { month: 'Mar', collected: 480, recycled: 350, complaints: 52 },
  { month: 'Apr', collected: 600, recycled: 450, complaints: 30 },
  { month: 'May', collected: 550, recycled: 420, complaints: 28 },
  { month: 'Jun', collected: 650, recycled: 520, complaints: 22 },
];

const categoryData = [
  { name: 'Plastic', value: 35, color: '#8b5cf6' },
  { name: 'Paper', value: 25, color: '#3b82f6' },
  { name: 'Glass', value: 15, color: '#06b6d4' },
  { name: 'Organic', value: 20, color: '#22c55e' },
  { name: 'Metal', value: 5, color: '#f59e0b' },
];

const zoneData = [
  { zone: 'North', efficiency: 92, collections: 156 },
  { zone: 'South', efficiency: 87, collections: 134 },
  { zone: 'East', efficiency: 95, collections: 178 },
  { zone: 'West', efficiency: 82, collections: 112 },
  { zone: 'Central', efficiency: 98, collections: 201 },
];

const Analytics: React.FC = () => {
  const kpis = [
    { label: 'Total Collected', value: '3,250 tons', change: '+15%', up: true },
    { label: 'Recycling Rate', value: '72.4%', change: '+5.2%', up: true },
    { label: 'Avg Response Time', value: '2.3 hrs', change: '-18%', up: true },
    { label: 'Carbon Offset', value: '1,850 kg', change: '+22%', up: true },
  ];

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Insights</span>
          <h1 className="section-title mt-2 text-gray-900 dark:text-white">Reports & <span className="gradient-text">Analytics</span></h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Comprehensive waste management analytics and performance metrics.</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
              <span className={`text-sm font-medium flex items-center gap-1 mt-1 ${kpi.up ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.up ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}{kpi.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiBarChart2 />Monthly Collection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" /><YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="collected" stroke="#8b5cf6" fill="#8b5cf620" strokeWidth={2} />
                <Area type="monotone" dataKey="recycled" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Waste by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {categoryData.map(c => (
                <span key={c.name} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />{c.name} ({c.value}%)
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Zone Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card-solid p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Zone Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zoneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="zone" stroke="#9ca3af" /><YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="efficiency" fill="#22c55e" radius={[8, 8, 0, 0]} name="Efficiency %" />
              <Bar dataKey="collections" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Collections" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
