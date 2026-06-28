import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sustainabilityAPI } from '../../services/sustainabilityApi';
import type { CarbonReportData, MarketplaceListingData, CommunityPostData, CommunityEventData } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { FiAward, FiCompass, FiLayers, FiUsers, FiShield, FiTrendingUp, FiSearch, FiPlus, FiMessageSquare, FiHeart, FiMapPin, FiCalendar, FiUploadCloud, FiTrendingDown, FiCheck } from 'react-icons/fi';

const SustainabilityEcosystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'rewards' | 'carbon' | 'marketplace' | 'community' | 'admin'>('rewards');
  const [loading, setLoading] = useState(true);

  // Rewards State
  const [missions, setMissions] = useState<any>({ dailyMissions: [], weeklyChallenges: [] });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [qrCodeData, setQrCodeData] = useState({ materialType: 'plastic', weight: 1.0 });

  // Carbon State
  const [carbonReport, setCarbonReport] = useState<CarbonReportData | null>(null);
  const [communityTotalSaved, setCommunityTotalSaved] = useState(0);

  // Marketplace State
  const [listings, setListings] = useState<MarketplaceListingData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('');
  const [newListing, setNewListing] = useState({ title: '', description: '', materialType: 'plastic', weight: 1, price: 10, address: '' });
  const [showAddListing, setShowAddListing] = useState(false);
  const [bidAmount, setBidAmount] = useState<{ [id: string]: number }>({});
  const [pickupDate, setPickupDate] = useState<{ [id: string]: string }>({});

  // Community State
  const [posts, setPosts] = useState<CommunityPostData[]>([]);
  const [events, setEvents] = useState<CommunityEventData[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general_discussion' });
  const [commentText, setCommentText] = useState<{ [id: string]: string }>({});
  const [dumpReport, setDumpReport] = useState({ title: '', description: '', address: '' });

  // Admin State
  const [fraudLogs, setFraudLogs] = useState<any[]>([]);

  const fetchEcosystemData = useCallback(async () => {
    try {
      const [missionsRes, carbonRes, marketplaceRes, postsRes, eventsRes] = await Promise.all([
        sustainabilityAPI.getMissions(),
        sustainabilityAPI.getCarbonReport(),
        sustainabilityAPI.getListings(),
        sustainabilityAPI.getCommunityPosts(),
        sustainabilityAPI.getCleanupEvents()
      ]);

      setMissions(missionsRes.data);
      setCarbonReport(carbonRes.data.data);
      setCommunityTotalSaved(carbonRes.data.communityTotalSaved);
      setListings(marketplaceRes.data.data);
      setPosts(postsRes.data.data);
      setEvents(eventsRes.data.data);

      if (user?.role === 'admin') {
        const fraudRes = await sustainabilityAPI.getFraudAudits();
        setFraudLogs(fraudRes.data.data);
      }
    } catch (e) {
      console.error('Error fetching ecosystem data', e);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEcosystemData();
  }, [fetchEcosystemData]);

  // QR verification scan simulation
  const handleQRVerify = async () => {
    try {
      const res = await sustainabilityAPI.verifyQR({
        qrData: 'MOCK_QR_CODE_SMART_BIN_049',
        materialType: qrCodeData.materialType,
        weight: qrCodeData.weight
      });
      alert(`Success! Awarded ${res.data.pointsAwarded} Green Points and saved ${res.data.carbonSaved.toFixed(1)}kg CO2!`);
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
      alert('Verification failed.');
    }
  };

  // Referral code submission
  const handleReferralSubmit = async () => {
    if (!referralCode.trim()) return;
    try {
      await sustainabilityAPI.claimReferral(referralCode);
      alert('Referral points claimed!');
      setReferralCode('');
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
      alert('Invalid or expired referral code.');
    }
  };

  // Create marketplace listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sustainabilityAPI.createListing({
        ...newListing,
        coordinates: [72.8777, 19.076]
      });
      setShowAddListing(false);
      setNewListing({ title: '', description: '', materialType: 'plastic', weight: 1, price: 10, address: '' });
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
    }
  };

  // Place a marketplace bid
  const handlePlaceBid = async (id: string) => {
    const amount = bidAmount[id];
    if (!amount || amount <= 0) return;
    try {
      await sustainabilityAPI.placeBid(id, amount);
      alert('Bid placed successfully!');
      fetchEcosystemData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to place bid');
    }
  };

  // Accept bid & Schedule pickup
  const handleAcceptBid = async (id: string) => {
    const date = pickupDate[id];
    if (!date) return alert('Please enter a pickup schedule date');
    try {
      await sustainabilityAPI.schedulePickup(id, date);
      alert('Pickup scheduled!');
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
    }
  };

  // Create Community discussion post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sustainabilityAPI.createPost(newPost);
      setNewPost({ title: '', content: '', category: 'general_discussion' });
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
    }
  };

  // Add Comment
  const handleAddComment = async (postId: string) => {
    const content = commentText[postId];
    if (!content?.trim()) return;
    try {
      await sustainabilityAPI.addComment(postId, content);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
    }
  };

  // Volunteer for event
  const handleVolunteer = async (eventId: string) => {
    try {
      await sustainabilityAPI.volunteerForEvent(eventId);
      alert('Registered as volunteer!');
      fetchEcosystemData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Volunteer registration failed');
    }
  };

  // Illegal dumping report
  const handleDumpReport = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Illegal dumping report submitted to municipality with simulated GPS and image data!');
    setDumpReport({ title: '', description: '', address: '' });
  };

  // Admin Moderate Listing
  const handleModerate = async (id: string, status: string) => {
    try {
      await sustainabilityAPI.moderateListing(id, { status, notes: 'Reviewed by automated moderator' });
      alert(`Listing marked as ${status}`);
      fetchEcosystemData();
    } catch (e) {
      console.error(e);
    }
  };

  const carbonChartData = carbonReport ? Object.entries(carbonReport.recycledWeights).map(([name, value]) => ({
    name: name.toUpperCase(),
    value: value || 0
  })) : [];

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative p-6 md:p-8 bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-950 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 bg-emerald-400/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Citizen Portal</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Sustainability Ecosystem</h1>
          <p className="text-emerald-200 max-w-xl text-sm md:text-base">Earn rewards, offset carbon footprints, trade waste materials, and unite with your local community to make the city cleaner.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#1e293b] border border-[#334155] rounded-2xl overflow-x-auto">
        {[
          { id: 'rewards', label: '🏆 Rewards & Missions', icon: FiAward },
          { id: 'carbon', label: '🌱 Carbon Calculator', icon: FiCompass },
          { id: 'marketplace', label: '🛍️ Waste Marketplace', icon: FiLayers },
          { id: 'community', label: '🤝 Community Hub', icon: FiUsers },
          ...(user?.role === 'admin' ? [{ id: 'admin', label: '🛡️ Admin Console', icon: FiShield }] : [])
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === t.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}>
            <t.icon size={16}/> {t.label}
          </button>
        ))}
      </div>

      {/* REWARDS TAB */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Missions List */}
            <div className="bg-[#1e293b]/70 backdrop-blur-xl border border-[#334155] rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">🔥 Active Challenges & Missions</h2>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Daily Missions</h3>
                {missions.dailyMissions?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-[#0f172a]/60 rounded-2xl border border-[#334155]/60">
                    <div>
                      <p className="text-white font-medium text-sm">{m.title}</p>
                      <p className="text-gray-400 text-xs mt-1">Progress: {m.current} / {m.target}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg">+{m.reward} pts</span>
                      {m.completed ? <FiCheck className="text-emerald-400" size={18}/> : <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"/>}
                    </div>
                  </div>
                ))}

                <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider mt-6 mb-2">Weekly Challenges</h3>
                {missions.weeklyChallenges?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-[#0f172a]/60 rounded-2xl border border-[#334155]/60">
                    <div>
                      <p className="text-white font-medium text-sm">{m.title}</p>
                      <div className="w-48 h-1.5 bg-[#1e293b] rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${(m.current / m.target) * 100}%` }}/>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-teal-500/10 text-teal-400 rounded-lg">+{m.reward} pts</span>
                      {m.completed ? <FiCheck className="text-teal-400" size={18}/> : <span className="text-xs text-gray-400">{Math.round((m.current / m.target) * 100)}%</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Smart Bin QR Scanner */}
            <div className="bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">📲 Smart Bin Verification</h2>
              <p className="text-gray-400 text-sm mb-4">Simulate checking-in to deposit recyclable materials at an authorized smart IoT waste station.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1">Material Type</label>
                  <select value={qrCodeData.materialType} onChange={e => setQrCodeData({ ...qrCodeData, materialType: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                    <option value="plastic">Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="glass">Glass</option>
                    <option value="metal">Metal</option>
                    <option value="ewaste">E-waste</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold block mb-1">Weight (kg)</label>
                  <input type="number" step="0.1" value={qrCodeData.weight} onChange={e => setQrCodeData({ ...qrCodeData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"/>
                </div>
                <div className="flex items-end">
                  <button onClick={handleQRVerify} className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                    Verify QR Deposit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Points Summary Card */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#334155] rounded-3xl p-6 relative overflow-hidden">
              <h3 className="text-gray-400 text-sm font-medium">My Total Green Points</h3>
              <p className="text-4xl font-extrabold text-white mt-2 flex items-baseline gap-1">{user?.rewardPoints || 0} <span className="text-xs text-emerald-400">pts</span></p>
              <div className="mt-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                <span className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">🌱</span>
                <div><p className="text-white text-xs font-semibold">Tier Rank: Silver</p><p className="text-[10px] text-gray-400">150 points left to Gold tier</p></div>
              </div>
            </div>

            {/* Referral Card */}
            <div className="bg-[#1e293b]/70 border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-semibold text-sm">👥 Invite Friends</h3>
              <p className="text-xs text-gray-400 mt-1 mb-4">Enter a friend's referral code to receive 50 bonus Green Points immediately.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Referral Code" value={referralCode} onChange={e => setReferralCode(e.target.value)}
                  className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                <button onClick={handleReferralSubmit} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-sm font-semibold transition-colors">Apply</button>
              </div>
            </div>

            {/* Badges Container */}
            <div className="bg-[#1e293b]/70 border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-semibold text-sm mb-4">🏆 Achievement Badges</h3>
              <div className="grid grid-cols-4 gap-3">
                {['🌱', '🏆', '🛡️', '💖'].map((emoji, index) => (
                  <div key={index} className="flex flex-col items-center justify-center p-3 bg-[#0f172a]/60 rounded-xl border border-[#334155] hover:border-emerald-500/30 transition-all">
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-[10px] text-gray-400 mt-1">{['Start', 'Pro', 'Shield', 'Hero'][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARBON CALCULATOR TAB */}
      {activeTab === 'carbon' && (
        <div className="space-y-6">
          {/* Carbon Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Carbon Footprint Saved</span>
              <p className="text-3xl font-bold text-white mt-2">{carbonReport?.totalCarbonSaved?.toFixed(1) || '0.0'} <span className="text-sm font-normal text-gray-400">kg CO₂e</span></p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400"><FiTrendingUp/> 12% increase from last month</div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Community Impact Score</span>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{carbonReport?.monthlyImpactScore || 0} <span className="text-sm font-normal text-gray-400">pts</span></p>
              <div className="mt-4 text-xs text-gray-400">Contribution to citywide green score</div>
            </div>
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Community Total Saved</span>
              <p className="text-3xl font-bold text-purple-400 mt-2">{communityTotalSaved?.toFixed(0) || '0'} <span className="text-sm font-normal text-gray-400">kg CO₂</span></p>
              <div className="mt-4 text-xs text-gray-400">Aggregated savings of all verified citizens</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharts Bar Chart */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4">📊 Recycling Carbon Offset Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={carbonChartData.length > 0 ? carbonChartData : [{ name: 'EMPTY', value: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }}/>
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }}/>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}/>
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {carbonChartData.map((_, index) => <Cell key={index} fill={['#10b981', '#06b6d4', '#8b5cf6', '#eab308', '#ec4899', '#f97316'][index % 6]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI suggestions */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4">🤖 AI-Generated Sustainability Suggestions</h3>
              <div className="space-y-4">
                {carbonReport?.aiSuggestions?.map((s, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-[#0f172a] border border-[#334155] rounded-2xl">
                    <span className="text-2xl">💡</span>
                    <p className="text-gray-300 text-sm font-medium leading-relaxed">{s}</p>
                  </div>
                )) || <p className="text-gray-400 text-sm">Start scanning deposits to receive specialized carbon saving recommendations.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WASTE MARKETPLACE TAB */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 max-w-md bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden px-3 items-center">
              <FiSearch className="text-gray-400"/>
              <input type="text" placeholder="Search recyclable listings..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-2 py-2.5 text-white text-sm focus:outline-none"/>
            </div>
            <div className="flex items-center gap-3">
              <select value={filterMaterial} onChange={e => setFilterMaterial(e.target.value)}
                className="bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
                <option value="">All Materials</option>
                <option value="plastic">Plastic</option>
                <option value="paper">Paper</option>
                <option value="glass">Glass</option>
                <option value="metal">Metal</option>
                <option value="ewaste">E-waste</option>
              </select>
              <button onClick={() => setShowAddListing(true)} className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <FiPlus/> Sell Waste
              </button>
            </div>
          </div>

          {/* Add Listing Modal */}
          {showAddListing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddListing(false)}>
              <div className="bg-[#1e293b] border border-[#334155] rounded-3xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white">Create Recyclable Waste Listing</h3>
                <form onSubmit={handleCreateListing} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Listing Title</label>
                    <input type="text" required value={newListing.title} onChange={e => setNewListing({ ...newListing, title: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold block mb-1">Description</label>
                    <textarea required value={newListing.description} onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none h-20"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Material Type</label>
                      <select value={newListing.materialType} onChange={e => setNewListing({ ...newListing, materialType: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                        <option value="plastic">Plastic</option>
                        <option value="paper">Paper</option>
                        <option value="glass">Glass</option>
                        <option value="metal">Metal</option>
                        <option value="ewaste">E-waste</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Weight (kg)</label>
                      <input type="number" required value={newListing.weight} onChange={e => setNewListing({ ...newListing, weight: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Starting Price ($)</label>
                      <input type="number" required value={newListing.price} onChange={e => setNewListing({ ...newListing, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-semibold block mb-1">Pickup Address</label>
                      <input type="text" required value={newListing.address} onChange={e => setNewListing({ ...newListing, address: e.target.value })}
                        className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button type="button" onClick={() => setShowAddListing(false)} className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-xl text-sm font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold">Post Listing</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Listings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings
              .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) && (!filterMaterial || l.materialType === filterMaterial))
              .map(l => (
                <div key={l._id} className="bg-[#1e293b] border border-[#334155] rounded-3xl p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-[#334155] text-gray-300 text-xs font-semibold rounded capitalize">{l.materialType}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${l.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{l.status}</span>
                    </div>
                    <h4 className="text-white font-bold text-base mt-3">{l.title}</h4>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed h-12 overflow-hidden">{l.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-[#0f172a]/60 rounded-xl border border-[#334155]/60 text-xs">
                      <div><span className="text-gray-500">Weight:</span> <span className="text-white font-medium">{l.weight} kg</span></div>
                      <div><span className="text-gray-500">Min Bid:</span> <span className="text-white font-medium">${l.price}</span></div>
                      <div className="col-span-2 mt-1"><span className="text-gray-500">Highest Bid:</span> <strong className="text-emerald-400 ml-1">${l.highestBid || 0}</strong></div>
                    </div>
                  </div>

                  {l.status === 'active' && (
                    <div className="mt-4 flex gap-2">
                      <input type="number" placeholder="Bid Amount" value={bidAmount[l._id] || ''} onChange={e => setBidAmount({ ...bidAmount, [l._id]: parseFloat(e.target.value) || 0 })}
                        className="w-20 bg-[#0f172a] border border-[#334155] rounded-xl px-2 py-1 text-white text-xs focus:outline-none"/>
                      <button onClick={() => handlePlaceBid(l._id)} className="flex-1 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-xs font-bold transition-all">Place Bid</button>
                    </div>
                  )}

                  {l.status === 'active' && l.seller?._id === user?._id && (
                    <div className="mt-3 pt-3 border-t border-[#334155] space-y-2">
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Accept Bid & Schedule Pickup</p>
                      <div className="flex gap-2">
                        <input type="datetime-local" value={pickupDate[l._id] || ''} onChange={e => setPickupDate({ ...pickupDate, [l._id]: e.target.value })}
                          className="flex-1 bg-[#0f172a] border border-[#334155] rounded-xl px-2 py-1 text-white text-xs focus:outline-none"/>
                        <button onClick={() => handleAcceptBid(l._id)} className="px-3 py-1 bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 rounded-xl text-xs font-bold">Accept</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* COMMUNITY HUB TAB */}
      {activeTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Discussion Feed */}
            <div className="bg-[#1e293b]/70 border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4">💬 Public Discussion Board</h3>
              {/* Add Post Form */}
              <form onSubmit={handleCreatePost} className="p-4 bg-[#0f172a]/60 border border-[#334155] rounded-2xl mb-6 space-y-3">
                <input type="text" placeholder="Post Title" required value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none"/>
                <textarea placeholder="Write something eco-friendly..." required value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-3 py-2 text-white text-sm focus:outline-none h-16"/>
                <div className="flex justify-between items-center">
                  <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                    className="bg-[#1e293b] border border-[#334155] rounded-lg px-2 py-1 text-white text-xs">
                    <option value="recycling_tips">Recycling Tips</option>
                    <option value="general_discussion">General</option>
                    <option value="questions">Questions</option>
                  </select>
                  <button type="submit" className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-semibold">Post Feed</button>
                </div>
              </form>

              {/* Feed List */}
              <div className="space-y-4">
                {posts.map(p => (
                  <div key={p._id} className="p-4 bg-[#0f172a]/40 border border-[#334155] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-white capitalize">{p.author?.name?.[0]}</div>
                      <div>
                        <p className="text-white text-xs font-semibold">{p.author?.name}</p>
                        <p className="text-gray-500 text-[10px]">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="ml-auto px-2 py-0.5 bg-[#334155] text-gray-300 text-[10px] rounded capitalize">{p.category?.replace('_', ' ')}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm mt-3">{p.title}</h4>
                    <p className="text-gray-300 text-xs mt-1 leading-relaxed">{p.content}</p>

                    {/* Comments Section */}
                    <div className="mt-4 pt-3 border-t border-[#334155]/60 space-y-2">
                      {p.comments?.map((c, i) => (
                        <div key={i} className="text-xs bg-[#0f172a]/80 p-2.5 rounded-xl border border-[#334155]/50">
                          <span className="font-semibold text-emerald-400">{c.author?.name}:</span> <span className="text-gray-300">{c.content}</span>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input type="text" placeholder="Add a comment..." value={commentText[p._id] || ''} onChange={e => setCommentText({ ...commentText, [p._id]: e.target.value })}
                          className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"/>
                        <button onClick={() => handleAddComment(p._id)} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">Send</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Cleanup events */}
            <div className="bg-[#1e293b]/70 border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">🗓️ Cleanup Drives</h3>
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev._id} className="p-4 bg-[#0f172a] border border-[#334155] rounded-2xl space-y-2">
                    <p className="text-white font-bold text-sm">{ev.title}</p>
                    <p className="text-gray-400 text-xs">{ev.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500"><FiCalendar/> {new Date(ev.date).toLocaleDateString()}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500"><FiMapPin/> {ev.location?.address}</div>
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[10px] text-emerald-400 font-semibold">{ev.volunteers?.length || 0} Registered</span>
                      <button onClick={() => handleVolunteer(ev._id)} className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-semibold">Join Drive</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illegal dumping reports */}
            <div className="bg-[#1e293b]/70 border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-2">🚨 Report Dumping</h3>
              <p className="text-gray-400 text-xs mb-4">Spotted unauthorized waste dump or filled trash container? File an instant report to alerts dispatch.</p>
              <form onSubmit={handleDumpReport} className="space-y-3">
                <input type="text" placeholder="Title/Type of Waste" required value={dumpReport.title} onChange={e => setDumpReport({ ...dumpReport, title: e.target.value })}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"/>
                <input type="text" placeholder="Address/Location details" required value={dumpReport.address} onChange={e => setDumpReport({ ...dumpReport, address: e.target.value })}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"/>
                <textarea placeholder="Describe dimensions, overflow levels, or details..." required value={dumpReport.description} onChange={e => setDumpReport({ ...dumpReport, description: e.target.value })}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none h-16"/>
                <button type="submit" className="w-full py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1">
                  <FiUploadCloud/> Send Dump Report
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN CONSOLE TAB */}
      {activeTab === 'admin' && user?.role === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Moderation section */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4">🛡️ Active Marketplace Audits</h3>
              <div className="space-y-3">
                {listings.filter(l => l.status === 'active').map(l => (
                  <div key={l._id} className="flex justify-between items-center p-4 bg-[#0f172a] border border-[#334155] rounded-2xl text-xs">
                    <div>
                      <p className="text-white font-bold">{l.title}</p>
                      <p className="text-gray-400 mt-1">Seller: {l.seller?.name || 'Unknown'} | Weight: {l.weight} kg</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleModerate(l._id, 'sold')} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 font-semibold">Verify</button>
                      <button onClick={() => handleModerate(l._id, 'cancelled')} className="px-2.5 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 font-semibold">Flag</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud logs */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-3xl p-6">
              <h3 className="text-white font-bold text-base mb-4">🕵️ Fraud & Integrity Auditing</h3>
              <div className="space-y-3">
                {fraudLogs.map((log, index) => (
                  <div key={index} className="p-3 bg-[#0f172a] border border-red-500/20 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-bold text-red-400 uppercase">{log.type}</span>
                      <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{log.details}</p>
                  </div>
                ))}
                {fraudLogs.length === 0 && <p className="text-gray-400 text-xs text-center py-8">No integrity risks detected</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityEcosystem;
