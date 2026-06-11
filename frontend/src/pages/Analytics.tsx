import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiCalendar, FiDownload, FiLoader } from 'react-icons/fi';

const allTimeData = {
  monthly: [
    { month: 'Jan', collected: 450, recycled: 320, efficiency: 71 },
    { month: 'Feb', collected: 520, recycled: 380, efficiency: 73 },
    { month: 'Mar', collected: 480, recycled: 350, efficiency: 72 },
    { month: 'Apr', collected: 600, recycled: 450, efficiency: 75 },
    { month: 'May', collected: 550, recycled: 420, efficiency: 76 },
    { month: 'Jun', collected: 650, recycled: 520, efficiency: 80 },
    { month: 'Jul', collected: 700, recycled: 580, efficiency: 82 },
  ],
  category: [
    { name: 'Plastic', value: 35, color: '#8b5cf6' },
    { name: 'Paper', value: 25, color: '#3b82f6' },
    { name: 'Glass', value: 15, color: '#06b6d4' },
    { name: 'Organic', value: 20, color: '#22c55e' },
    { name: 'Metal', value: 5, color: '#f59e0b' },
  ],
  zone: [
    { zone: 'North', efficiency: 92, complaints: 12 },
    { zone: 'South', efficiency: 87, complaints: 24 },
    { zone: 'East', efficiency: 95, complaints: 8 },
    { zone: 'West', efficiency: 82, complaints: 35 },
    { zone: 'Central', efficiency: 98, complaints: 5 },
  ],
  kpis: [
    { label: 'Total Collected', value: '3,950 tons', change: '+18.5%', up: true },
    { label: 'Avg Recycling Rate', value: '75.5%', change: '+5.2%', up: true },
    { label: 'Active Complaints', value: '84', change: '-12%', up: true },
    { label: 'Carbon Offset', value: '2,450 kg', change: '+22%', up: true },
  ]
};

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('6M');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(allTimeData);

  // Simulate API fetch on filter change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Simulate slight data variations based on range
      const factor = dateRange === '1M' ? 0.3 : dateRange === '3M' ? 0.6 : 1;
      setData({
        monthly: allTimeData.monthly.slice(0, dateRange === '1M' ? 1 : dateRange === '3M' ? 3 : 7).map(d => ({...d})),
        category: allTimeData.category.map(c => ({...c, value: Math.max(5, Math.round(c.value * (1 + (Math.random() * 0.2 - 0.1))))})),
        zone: allTimeData.zone.map(z => ({...z})),
        kpis: allTimeData.kpis.map(k => ({...k, value: k.value.replace(/[0-9.]+/g, (m) => (parseFloat(m) * factor).toFixed(k.value.includes('.') ? 1 : 0))}))
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExport = () => {
    alert("Report exported successfully as PDF.");
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0f172a]/50 p-6 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive overview of waste management metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              title="Select date range"
              aria-label="Select date range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-[#1e293b] border border-[#334155] rounded-xl text-white focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="YTD">Year to Date</option>
            </select>
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors font-medium">
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium">Compiling analytics report...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={dateRange}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.kpis.map((kpi, i) => (
                <div key={i} className="glass-card-solid p-6 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  <p className="text-sm font-medium text-gray-400 mb-2 relative z-10">{kpi.label}</p>
                  <h3 className="text-3xl font-display font-bold text-white mb-2 relative z-10">{kpi.value}</h3>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold relative z-10 ${kpi.up ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {kpi.up ? <FiTrendingUp /> : <FiTrendingDown />}
                    {kpi.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Collection Trends */}
              <div className="lg:col-span-2 glass-card-solid p-6 rounded-3xl border border-[#334155]/50">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <FiBarChart2 className="text-primary-500" /> Collection vs. Recycling Volume
                </h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRecycled" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Area type="monotone" dataKey="collected" name="Total Collected (Tons)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCollected)" />
                      <Area type="monotone" dataKey="recycled" name="Successfully Recycled (Tons)" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRecycled)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Material Breakdown */}
              <div className="glass-card-solid p-6 rounded-3xl border border-[#334155]/50 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6">Material Breakdown</h3>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.category}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.category.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {data.category.map(c => (
                    <div key={c.name} className="flex items-center justify-between p-2 rounded-xl bg-[#0f172a] border border-[#334155]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full color-dot" data-color={c.color} style={{ ['--dot-color' as string]: c.color }} aria-hidden="true" />
                        <span className="text-sm font-medium text-gray-300">{c.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Zone Performance */}
              <div className="glass-card-solid p-6 rounded-3xl border border-[#334155]/50">
                <h3 className="text-lg font-bold text-white mb-6">Zone Efficiency vs Complaints</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.zone} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="zone" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                        cursor={{ fill: '#334155', opacity: 0.4 }}
                      />
                      <Legend iconType="circle" />
                      <Bar yAxisId="left" dataKey="efficiency" name="Efficiency (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar yAxisId="right" dataKey="complaints" name="Active Complaints" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Efficiency Trend */}
              <div className="glass-card-solid p-6 rounded-3xl border border-[#334155]/50">
                <h3 className="text-lg font-bold text-white mb-6">Overall System Efficiency</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                      />
                      <Line type="monotone" dataKey="efficiency" name="Efficiency Score" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#1e293b', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Analytics;
