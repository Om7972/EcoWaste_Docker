import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiTrendingUp, FiCheckCircle, FiClock, FiFileText, FiAward, FiPlus } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

const trendData = [
  { day: 'Mon', complaints: 12, resolved: 10 },
  { day: 'Tue', complaints: 19, resolved: 15 },
  { day: 'Wed', complaints: 8, resolved: 8 },
  { day: 'Thu', complaints: 15, resolved: 12 },
  { day: 'Fri', complaints: 22, resolved: 18 },
  { day: 'Sat', complaints: 10, resolved: 9 },
  { day: 'Sun', complaints: 5, resolved: 5 },
];

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const stats = [
    { label: 'Total Reports', value: '1,247', change: '+12%', icon: FiFileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Resolved', value: '1,089', change: '+8%', icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Pending', value: '158', change: '-5%', icon: FiClock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Reward Points', value: user?.rewardPoints?.toString() || '2,450', change: '+320', icon: FiAward, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            {isAdmin ? 'Admin Dashboard' : 'Dashboard Overview'}
          </h1>
          <p className="text-gray-400 mt-1 text-lg">Welcome back, <span className="text-white font-medium">{user?.name || 'User'}</span> 👋</p>
        </div>
        <Link to="/dashboard/complaints" className="btn-primary flex items-center gap-2 px-6 py-3 shadow-neon-green">
          <FiPlus size={18} /> New Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
            className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${stat.change.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                <FiTrendingUp size={12} className={stat.change.startsWith('-') ? 'rotate-180' : ''} />
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Activity Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorComplaints)" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Reports</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-[#334155]/50 hover:border-[#334155] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                    <FiFileText />
                  </div>
                  <div>
                    <h4 className="text-gray-200 font-medium group-hover:text-primary-400 transition-colors">Overflowing Bin on 5th Ave</h4>
                    <p className="text-gray-500 text-sm flex items-center gap-2"><FiClock size={12}/> 2 hours ago</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
