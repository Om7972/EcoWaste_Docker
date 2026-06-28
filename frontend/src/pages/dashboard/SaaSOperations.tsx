import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saasAPI } from '../../services/saasApi';
import type { Organization, Vehicle, Driver, ExpenseData, KPIMetricData } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line } from 'recharts';
import { FiSliders, FiTruck, FiUserCheck, FiDollarSign, FiZap, FiCpu, FiTrendingUp, FiSettings, FiPlus, FiCheckCircle } from 'react-icons/fi';

const SaaSOperations: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'kpi' | 'fleet' | 'expense' | 'automation'>('kpi');
  const [loading, setLoading] = useState(true);

  // Core SaaS State
  const [tenant, setTenant] = useState<Organization | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [kpis, setKpis] = useState<KPIMetricData[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [aiForecast, setAiForecast] = useState<any>(null);

  // Modals & Inputs
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', model: '', capacity: 2500, fuelType: 'diesel', fuelEfficiency: 8.5 });

  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ driverUserId: '', licenseNumber: '', assignedVehicleId: '' });

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: 'fuel', amount: 50, description: '', vehicleId: '' });

  const fetchSaaSData = useCallback(async () => {
    try {
      const [tenantRes, vehiclesRes, driversRes, expensesRes, kpiRes, forecastRes] = await Promise.all([
        saasAPI.getTenantInfo(),
        saasAPI.getVehicles(),
        saasAPI.getDrivers(),
        saasAPI.getExpenses(),
        saasAPI.getKPIDashboard(),
        saasAPI.getAIOperationalForecast()
      ]);

      setTenant(tenantRes.data.data);
      setVehicles(vehiclesRes.data.data);
      setDrivers(driversRes.data.data);
      setExpenses(expensesRes.data.data);
      setKpis(kpiRes.data.data.metrics);
      setTotalExpenses(kpiRes.data.data.totalExpenses);
      setAiForecast(forecastRes.data.data);
    } catch (e) {
      console.error('Error loading SaaS workspace details', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSaaSData();
  }, [fetchSaaSData]);

  // Operations actions
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saasAPI.addVehicle(newVehicle);
      setShowAddVehicle(false);
      setNewVehicle({ plateNumber: '', model: '', capacity: 2500, fuelType: 'diesel', fuelEfficiency: 8.5 });
      fetchSaaSData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saasAPI.addDriver(newDriver);
      setShowAddDriver(false);
      setNewDriver({ driverUserId: '', licenseNumber: '', assignedVehicleId: '' });
      fetchSaaSData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saasAPI.addExpense(newExpense);
      setShowAddExpense(false);
      setNewExpense({ category: 'fuel', amount: 50, description: '', vehicleId: '' });
      fetchSaaSData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerAutomation = async () => {
    try {
      const res = await saasAPI.triggerAutomation();
      alert(`Automation Complete!\n- SLA Escalations: ${res.data.escalatedComplaints}\n- Drivers Assigned: ${res.data.driversAssigned}`);
      fetchSaaSData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-12">
      {/* SaaS Workspace Header Banner */}
      <div className="relative p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-indigo-400/20 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">SaaS Workspace</span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{tenant?.name}</h1>
            <p className="text-slate-300 text-sm md:text-base">City: {tenant?.city} | Workspace Domain: <span className="font-mono text-indigo-400">{tenant?.domain}</span></p>
          </div>
          {/* Subscription info */}
          <div className="bg-[#0f172a]/60 border border-slate-700/60 p-4 rounded-2xl space-y-1.5 min-w-[200px]">
            <p className="text-xs text-slate-400 font-bold uppercase">Subscription Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"/>
              <p className="text-white text-base font-extrabold capitalize">{tenant?.subscription?.plan} Plan</p>
            </div>
            <p className="text-[10px] text-slate-500">Limits: Bins ({tenant?.subscription?.usageLimits?.maxBins}), Fleet ({tenant?.subscription?.usageLimits?.maxVehicles})</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#1e293b] border border-[#334155] rounded-2xl overflow-x-auto">
        {[
          { id: 'kpi', label: '📊 KPI Analytics', icon: FiSliders },
          { id: 'fleet', label: '🚚 Fleet Operations', icon: FiTruck },
          { id: 'expense', label: '💰 Expense Manager', icon: FiDollarSign },
          { id: 'automation', label: '🤖 Automation Center', icon: FiZap }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === t.id ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white'}`}>
            <t.icon size={16}/> {t.label}
          </button>
        ))}
      </div>

      {/* KPI ANALYTICS TAB */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          {/* Stats widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Fleet', value: vehicles.length, icon: FiTruck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Drivers On Duty', value: drivers.filter(d => d.status === 'on_duty').length, icon: FiUserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Operational Cost', value: `$${totalExpenses}`, icon: FiDollarSign, color: 'text-teal-400', bg: 'bg-teal-500/10' },
              { label: 'SLA Escalations', value: '0 Critical', icon: FiSettings, color: 'text-red-400', bg: 'bg-red-500/10' }
            ].map((s, i) => (
              <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-3xl p-5">
                <div className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}><s.icon className={s.color} size={20}/></div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4">📈 Waste Generation vs AI Forecast</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={kpis.length > 0 ? kpis : [{
                  _id: 'default',
                  ward: 'Ward A',
                  date: new Date().toISOString(),
                  wasteCollectedKg: 400,
                  fuelConsumedLiters: 30,
                  costPerTon: 120,
                  resolvedComplaintsCount: 5,
                  totalComplaintsCount: 6,
                  averageResolutionTimeHours: 12,
                  collectionEfficiencyPercentage: 90,
                  predictedWasteKg: 450
                }]}>
                  <defs>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                  <XAxis dataKey="ward" tick={{ fill: '#94a3b8', fontSize: 11 }}/>
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}/>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}/>
                  <Area type="monotone" dataKey="wasteCollectedKg" stroke="#6366f1" fillOpacity={1} fill="url(#colorWaste)" name="Collected (kg)"/>
                  <Area type="monotone" dataKey="predictedWasteKg" stroke="#10b981" fillOpacity={1} fill="url(#colorPredict)" name="AI Forecast (kg)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* AI Operational Recommendations */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-base mb-2 flex items-center gap-2">🤖 AI Operations Analysis</h3>
                <p className="text-gray-400 text-xs mb-4">Seasonal pattern: <strong className="text-indigo-400">{aiForecast?.seasonalTrend || 'N/A'}</strong></p>
                <div className="space-y-4">
                  {aiForecast?.recommendations?.map((r: any, i: number) => (
                    <div key={i} className="flex gap-3 p-3 bg-[#0f172a] border border-[#334155] rounded-2xl">
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <p className="text-white font-bold text-xs">{r.title}</p>
                        <p className="text-gray-400 text-[10px] mt-1">{r.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLEET OPERATIONS TAB */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicles list */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-base">Fleet Vehicles</h3>
              <button onClick={() => setShowAddVehicle(true)} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1">
                <FiPlus/> Add Vehicle
              </button>
            </div>
            
            <div className="space-y-3">
              {vehicles.map(v => (
                <div key={v._id} className="p-4 bg-[#0f172a]/60 border border-[#334155]/60 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <p className="text-white font-bold">{v.plateNumber} — {v.model}</p>
                    <p className="text-gray-400 mt-1">Capacity: {v.capacity} kg | Fuel Type: <span className="capitalize">{v.fuelType}</span></p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${v.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{v.status}</span>
                </div>
              ))}
              {vehicles.length === 0 && <p className="text-gray-400 text-xs text-center py-8">No fleet vehicles registered.</p>}
            </div>
          </div>

          {/* Drivers list */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-base">Drivers Log</h3>
              <button onClick={() => setShowAddDriver(true)} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1">
                <FiPlus/> Add Driver
              </button>
            </div>

            <div className="space-y-3">
              {drivers.map(d => (
                <div key={d._id} className="p-4 bg-[#0f172a]/60 border border-[#334155]/60 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <p className="text-white font-bold">{d.user?.name || 'Assigned Driver'}</p>
                    <p className="text-gray-400 mt-1">License: {d.licenseNumber} | Rating: {d.rating} ⭐</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${d.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>{d.status}</span>
                </div>
              ))}
              {drivers.length === 0 && <p className="text-gray-400 text-xs text-center py-8">No driver assignments logged.</p>}
            </div>
          </div>

          {/* Add Vehicle Modal */}
          {showAddVehicle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddVehicle(false)}>
              <div className="bg-[#1e293b] border border-[#334155] rounded-3xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white">Add Vehicle to SaaS Fleet</h3>
                <form onSubmit={handleAddVehicle} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Plate Number</label>
                    <input type="text" required value={newVehicle.plateNumber} onChange={e => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Vehicle Model</label>
                    <input type="text" required value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Capacity (kg)</label>
                      <input type="number" required value={newVehicle.capacity} onChange={e => setNewVehicle({ ...newVehicle, capacity: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Fuel Type</label>
                      <select value={newVehicle.fuelType} onChange={e => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric (EV)</option>
                        <option value="cng">CNG</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button type="button" onClick={() => setShowAddVehicle(false)} className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-xl text-sm font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold">Register Vehicle</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Driver Modal */}
          {showAddDriver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddDriver(false)}>
              <div className="bg-[#1e293b] border border-[#334155] rounded-3xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white">Register Fleet Driver</h3>
                <form onSubmit={handleAddDriver} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Driver User ID</label>
                    <input type="text" required placeholder="User identifier" value={newDriver.driverUserId} onChange={e => setNewDriver({ ...newDriver, driverUserId: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">License Number</label>
                    <input type="text" required placeholder="E.g. DL-1234567" value={newDriver.licenseNumber} onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button type="button" onClick={() => setShowAddDriver(false)} className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-xl text-sm font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold">Add Driver</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXPENSE MANAGER TAB */}
      {activeTab === 'expense' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold text-base">Expense Log Book</h3>
              <p className="text-xs text-gray-400 mt-1">Total active municipal spend: <span className="text-teal-400 font-bold">${totalExpenses}</span></p>
            </div>
            <button onClick={() => setShowAddExpense(true)} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-1">
              <FiPlus/> Log Expense
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#334155] text-gray-400">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Logged By</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id} className="border-b border-[#334155]/60 hover:bg-[#334155]/20 text-slate-300">
                    <td className="px-4 py-3 capitalize font-semibold text-indigo-400">{exp.category}</td>
                    <td className="px-4 py-3 text-white font-bold">${exp.amount}</td>
                    <td className="px-4 py-3">{exp.loggedBy?.name || 'Operator'}</td>
                    <td className="px-4 py-3">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-400">{exp.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddExpense && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddExpense(false)}>
              <div className="bg-[#1e293b] border border-[#334155] rounded-3xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white">Log Operational Expense</h3>
                <form onSubmit={handleAddExpense} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Expense Category</label>
                    <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                      <option value="fuel">Fuel Purchase</option>
                      <option value="maintenance">Fleet Maintenance</option>
                      <option value="salary">Drivers Salary</option>
                      <option value="equipment">Bins & Equipment</option>
                      <option value="other">Other Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Amount ($)</label>
                    <input type="number" required value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Description</label>
                    <input type="text" value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button type="button" onClick={() => setShowAddExpense(false)} className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-xl text-sm font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold">Log Expense</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AUTOMATION CENTER TAB */}
      {activeTab === 'automation' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-[#334155] pb-4">
            <div>
              <h3 className="text-white font-bold text-lg">🤖 Multi-Tenant Operations Automator</h3>
              <p className="text-gray-400 text-xs mt-1">Automatic driver assigning, route generation, and complaints SLA monitoring workflows.</p>
            </div>
            <button onClick={handleTriggerAutomation} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
              Trigger Automation Pipeline
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f172a] border border-[#334155] p-5 rounded-2xl space-y-3">
              <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl block w-fit">⚡</span>
              <h4 className="text-white font-bold text-sm">Automatic Driver Assigning</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Runs every morning. Maps idle drivers to active fleet vehicles according to priority zones.</p>
            </div>

            <div className="bg-[#0f172a] border border-[#334155] p-5 rounded-2xl space-y-3">
              <span className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl block w-fit">📍</span>
              <h4 className="text-white font-bold text-sm">Dynamic Route Generation</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Constantly monitors bin fill alerts and computes optimized collection routes to minimize fuel spending.</p>
            </div>

            <div className="bg-[#0f172a] border border-[#334155] p-5 rounded-2xl space-y-3">
              <span className="p-2.5 bg-red-500/10 text-red-400 rounded-xl block w-fit">🚨</span>
              <h4 className="text-white font-bold text-sm">SLA Escalation Monitoring</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">Monitors complaints in real-time. Automatically escalates priority to critical for items unresolved past 24 hours.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaaSOperations;
