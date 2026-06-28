import React, { useState, useEffect, useCallback } from 'react';
import { smartBinAPI } from '../../services/smartBinApi';
import { useSocket } from '../../hooks/useSocket';
import type { SmartBin, BinAlert, SmartBinAnalytics } from '../../types';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiMapPin, FiAlertTriangle, FiTruck, FiActivity, FiBattery, FiThermometer, FiDroplet, FiRefreshCw, FiX, FiCheckCircle, FiClock, FiZap } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

const FILL_COLORS = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };
const STATUS_BG = { green: 'bg-emerald-500/10 border-emerald-500/30', yellow: 'bg-yellow-500/10 border-yellow-500/30', red: 'bg-red-500/10 border-red-500/30' };

const SmartBinDashboard: React.FC = () => {
  const [bins, setBins] = useState<SmartBin[]>([]);
  const [alerts, setAlerts] = useState<BinAlert[]>([]);
  const [analytics, setAnalytics] = useState<SmartBinAnalytics | null>(null);
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null);
  const [binDetail, setBinDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'analytics' | 'alerts' | 'routes'>('map');
  const [routeStops, setRouteStops] = useState<[number,number][]>([]);
  const { isConnected, subscribeToBins, onBinsUpdate, onNewAlert } = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const [binsRes, alertsRes, analyticsRes] = await Promise.all([
        smartBinAPI.getAll(), smartBinAPI.getAlerts({ resolved: 'false' }), smartBinAPI.getAnalytics('7d')
      ]);
      setBins(binsRes.data.data || []);
      setAlerts(alertsRes.data.data || []);
      setAnalytics(analyticsRes.data.data || null);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); subscribeToBins(); }, [fetchData, subscribeToBins]);
  useEffect(() => { return onBinsUpdate((b) => setBins(b)); }, [onBinsUpdate]);
  useEffect(() => { return onNewAlert((a) => setAlerts(prev => [a, ...prev])); }, [onNewAlert]);

  const openBinDetail = async (bin: SmartBin) => {
    setSelectedBin(bin);
    try { const r = await smartBinAPI.getById(bin._id); setBinDetail(r.data.data); } catch(e) { console.error(e); }
  };

  const generateRoute = async () => {
    try {
      const r = await smartBinAPI.generateRoute({ minFillLevel: 50, maxStops: 8 });
      const stops = r.data.data?.stops?.map((s: any) => [s.bin?.location?.coordinates?.[1] || 0, s.bin?.location?.coordinates?.[0] || 0] as [number,number]) || [];
      setRouteStops(stops);
      setActiveTab('map');
    } catch(e) { console.error(e); }
  };

  const summary = {
    total: bins.length,
    green: bins.filter(b => b.currentFillLevel < 40).length,
    yellow: bins.filter(b => b.currentFillLevel >= 40 && b.currentFillLevel < 80).length,
    red: bins.filter(b => b.currentFillLevel >= 80).length,
    avgFill: bins.length ? Math.round(bins.reduce((a,b) => a + b.currentFillLevel, 0) / bins.length) : 0,
    online: bins.filter(b => b.sensorStatus === 'online').length,
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-2 bg-emerald-500/20 rounded-xl"><FiMapPin className="text-emerald-400" size={24}/></span>
            Smart Bin Monitor
          </h1>
          <p className="text-gray-400 mt-1">Real-time IoT waste monitoring & AI predictions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}/> {isConnected ? 'Live' : 'Offline'}
          </span>
          <button onClick={fetchData} className="p-2 bg-[#1e293b] rounded-lg text-gray-400 hover:text-white transition-colors"><FiRefreshCw size={18}/></button>
          <button onClick={generateRoute} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            <FiTruck className="inline mr-2" size={16}/>Optimize Route
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Bins', value: summary.total, icon: FiMapPin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Low (<40%)', value: summary.green, icon: FiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Medium', value: summary.yellow, icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Critical (>80%)', value: summary.red, icon: FiAlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Avg Fill', value: `${summary.avgFill}%`, icon: FiActivity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Sensors Online', value: summary.online, icon: FiZap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 hover:border-emerald-500/30 transition-all">
            <div className={`${s.bg} w-9 h-9 rounded-lg flex items-center justify-center mb-2`}><s.icon className={s.color} size={18}/></div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-[#1e293b] p-1 rounded-xl overflow-x-auto">
        {(['map','list','analytics','alerts','routes'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
            {tab === 'map' ? '🗺️ City Map' : tab === 'list' ? '📋 Bin List' : tab === 'analytics' ? '📊 Analytics' : tab === 'alerts' ? `🚨 Alerts (${alerts.length})` : '🚚 Routes'}
          </button>
        ))}
      </div>

      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden" style={{ height: 500 }}>
          <MapContainer center={[19.076, 72.8777]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CartoDB'/>
            {bins.map(bin => (
              <CircleMarker key={bin._id} center={[bin.location.coordinates[1], bin.location.coordinates[0]]}
                radius={bin.currentFillLevel >= 80 ? 12 : 9}
                pathOptions={{ color: FILL_COLORS[bin.fillStatus] || '#22c55e', fillColor: FILL_COLORS[bin.fillStatus] || '#22c55e', fillOpacity: 0.7, weight: 2 }}
                eventHandlers={{ click: () => openBinDetail(bin) }}>
                <Popup>
                  <div className="text-sm"><strong>{bin.binId}</strong><br/>{bin.location.address}<br/>Fill: <b>{bin.currentFillLevel.toFixed(0)}%</b></div>
                </Popup>
              </CircleMarker>
            ))}
            {routeStops.length > 1 && <Polyline positions={routeStops} pathOptions={{ color: '#06b6d4', weight: 3, dashArray: '10 6' }}/>}
          </MapContainer>
        </div>
      )}

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#334155] text-gray-400">
                <th className="px-4 py-3 text-left">Bin ID</th><th className="px-4 py-3 text-left">Location</th><th className="px-4 py-3 text-left">Zone</th>
                <th className="px-4 py-3 text-left">Fill Level</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Battery</th>
                <th className="px-4 py-3 text-left">Type</th>
              </tr></thead>
              <tbody>
                {bins.map(bin => (
                  <tr key={bin._id} onClick={() => openBinDetail(bin)} className="border-b border-[#334155]/50 hover:bg-[#334155]/30 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-mono text-emerald-400">{bin.binId}</td>
                    <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{bin.location.address}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-[#334155] rounded text-xs text-gray-300">{bin.location.zone}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-[#0f172a] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${bin.currentFillLevel}%`, backgroundColor: FILL_COLORS[bin.fillStatus] }}/>
                        </div>
                        <span className="text-white font-medium">{bin.currentFillLevel.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs border ${STATUS_BG[bin.fillStatus]}`}>{bin.status}</span></td>
                    <td className="px-4 py-3"><FiBattery className={`inline mr-1 ${bin.batteryLevel > 30 ? 'text-emerald-400' : 'text-red-400'}`}/>{bin.batteryLevel.toFixed(0)}%</td>
                    <td className="px-4 py-3 capitalize text-gray-400">{bin.binType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">📈 Daily Collection Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.dailyTrends.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v:string) => v.slice(5)}/>
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }}/>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}/>
                  <Bar dataKey="wasteCollected" fill="#22c55e" radius={[4,4,0,0]} name="Waste (kg)"/>
                  <Bar dataKey="overflows" fill="#ef4444" radius={[4,4,0,0]} name="Overflows"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">🏘️ Zone Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={analytics.zoneDistribution} dataKey="bins" nameKey="zone" cx="50%" cy="50%" outerRadius={90} label={({ zone, bins: b }: any) => `${zone}: ${b}`}>
                    {analytics.zoneDistribution.map((_, i) => <Cell key={i} fill={['#22c55e','#06b6d4','#8b5cf6','#eab308','#ef4444'][i % 5]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Waste Collected', value: `${analytics.overview.totalWasteCollected} kg`, icon: '♻️' },
              { label: 'Route Efficiency', value: `${analytics.overview.routeEfficiency}%`, icon: '⚡' },
              { label: 'Fuel Saved', value: `${analytics.overview.fuelSaved} L`, icon: '⛽' },
              { label: 'Overflow Incidents', value: analytics.overview.overflowIncidents, icon: '🚨' },
            ].map((s, i) => (
              <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-xl font-bold text-white mt-2">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
          {/* AI Recommendations */}
          {analytics.recommendations && (
            <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">🤖 AI Recommendations</h3>
              <div className="space-y-3">
                {analytics.recommendations.map((r, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                    <span className="text-2xl">{r.icon}</span>
                    <div><p className="text-white font-medium text-sm">{r.title}</p><p className="text-gray-400 text-xs mt-1">{r.description}</p></div>
                    <span className={`ml-auto px-2 py-0.5 rounded text-xs h-fit ${r.priority === 'high' ? 'bg-red-500/20 text-red-400' : r.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{r.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">🚨 Active Alerts</h3>
          {alerts.length === 0 ? <p className="text-gray-400 text-center py-8">No active alerts</p> : (
            <div className="space-y-3">
              {alerts.slice(0, 20).map((alert) => (
                <div key={alert._id} className={`flex items-start gap-3 p-4 rounded-xl border ${alert.severity === 'critical' ? 'bg-red-500/5 border-red-500/30' : 'bg-yellow-500/5 border-yellow-500/30'}`}>
                  <FiAlertTriangle className={alert.severity === 'critical' ? 'text-red-400 mt-0.5' : 'text-yellow-400 mt-0.5'} size={18}/>
                  <div className="flex-1">
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{alert.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">🚚 Collection Routes</h3>
            <button onClick={generateRoute} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors">Generate New Route</button>
          </div>
          {routeStops.length > 0 ? (
            <div className="space-y-2">
              {routeStops.map((stop, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-xl border border-[#334155]">
                  <span className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center text-sm font-bold">{i+1}</span>
                  <span className="text-gray-300 text-sm">Stop {i+1}: ({stop[0].toFixed(4)}, {stop[1].toFixed(4)})</span>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-center py-8">No routes generated yet. Click "Generate New Route" to optimize collection.</p>}
        </div>
      )}

      {/* Bin Detail Modal */}
      {selectedBin && binDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setSelectedBin(null); setBinDetail(null); }}>
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{binDetail.bin?.binId} — {binDetail.bin?.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{binDetail.bin?.location?.address}</p>
              </div>
              <button onClick={() => { setSelectedBin(null); setBinDetail(null); }} className="p-2 hover:bg-[#334155] rounded-lg text-gray-400"><FiX size={20}/></button>
            </div>
            {/* Fill Level Gauge */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-[#0f172a] rounded-xl">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="42" fill="none" stroke={FILL_COLORS[(binDetail.bin?.fillStatus as 'green' | 'yellow' | 'red') || 'green']} strokeWidth="8"
                    strokeDasharray={`${(binDetail.bin?.currentFillLevel || 0) * 2.64} 264`} strokeLinecap="round" className="transition-all duration-1000"/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">{binDetail.bin?.currentFillLevel?.toFixed(0)}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div><FiThermometer className="inline text-orange-400 mr-1"/><span className="text-gray-400 text-sm">Temp:</span><span className="text-white ml-1">{binDetail.bin?.metadata?.temperature?.toFixed(1)}°C</span></div>
                <div><FiDroplet className="inline text-blue-400 mr-1"/><span className="text-gray-400 text-sm">Humidity:</span><span className="text-white ml-1">{binDetail.bin?.metadata?.humidity?.toFixed(1)}%</span></div>
                <div><FiBattery className="inline text-emerald-400 mr-1"/><span className="text-gray-400 text-sm">Battery:</span><span className="text-white ml-1">{binDetail.bin?.batteryLevel?.toFixed(0)}%</span></div>
                <div><FiActivity className="inline text-purple-400 mr-1"/><span className="text-gray-400 text-sm">Weight:</span><span className="text-white ml-1">{binDetail.bin?.metadata?.weight?.toFixed(1)} kg</span></div>
              </div>
            </div>
            {/* Prediction */}
            {binDetail.prediction && (
              <div className={`p-4 rounded-xl mb-6 border ${binDetail.prediction.riskLevel === 'critical' ? 'bg-red-500/5 border-red-500/30' : binDetail.prediction.riskLevel === 'high' ? 'bg-orange-500/5 border-orange-500/30' : 'bg-emerald-500/5 border-emerald-500/30'}`}>
                <p className="text-white font-medium text-sm">🔮 AI Prediction</p>
                <p className="text-gray-300 text-sm mt-1">{binDetail.prediction.recommendation}</p>
                {binDetail.prediction.hoursToOverflow && <p className="text-gray-400 text-xs mt-1">Estimated overflow in: <strong className="text-white">{binDetail.prediction.hoursToOverflow}h</strong> (Confidence: {binDetail.prediction.confidence}%)</p>}
              </div>
            )}
            {/* Historical Chart */}
            {binDetail.recentReadings?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">📊 Fill Level History</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={binDetail.recentReadings.slice().reverse().slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                    <XAxis dataKey="timestamp" tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v:string) => new Date(v).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}/>
                    <YAxis domain={[0,100]} tick={{ fill: '#94a3b8', fontSize: 10 }}/>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}/>
                    <Line type="monotone" dataKey="fillLevel" stroke="#22c55e" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartBinDashboard;
