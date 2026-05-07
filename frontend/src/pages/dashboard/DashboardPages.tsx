import React from 'react';
import { FiSettings, FiBell, FiAward, FiFileText } from 'react-icons/fi';

export const Complaints: React.FC = () => (
  <div className="animate-fade-in space-y-6">
    <h1 className="text-3xl font-display font-bold text-white">Complaints</h1>
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-12 text-center">
      <div className="w-20 h-20 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
        <FiFileText size={32} />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">No active complaints</h2>
      <p className="text-gray-400">All garbage reports have been resolved in your area.</p>
    </div>
  </div>
);

export const Rewards: React.FC = () => (
  <div className="animate-fade-in space-y-6">
    <h1 className="text-3xl font-display font-bold text-white">Rewards Hub</h1>
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 flex items-center justify-between">
      <div>
        <p className="text-purple-300 font-medium mb-1">Current Balance</p>
        <h2 className="text-5xl font-bold text-white">2,450 <span className="text-2xl text-purple-400">pts</span></h2>
      </div>
      <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
        <FiAward size={40} className="text-white" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 hover:border-purple-500/50 transition-colors cursor-pointer">
          <div className="h-32 bg-[#0f172a] rounded-lg mb-4 flex items-center justify-center">🎁 Reward {i}</div>
          <h3 className="text-white font-bold mb-1">Eco Coffee Cup</h3>
          <p className="text-purple-400 font-medium text-sm">500 pts</p>
        </div>
      ))}
    </div>
  </div>
);

export const Notifications: React.FC = () => (
  <div className="animate-fade-in space-y-6">
    <h1 className="text-3xl font-display font-bold text-white">Notifications</h1>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex gap-4 items-start">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><FiBell size={20} /></div>
          <div>
            <h4 className="text-gray-200 font-medium">Report Resolved</h4>
            <p className="text-gray-400 text-sm mt-1">Your report for "Overflowing bin" has been resolved by municipal workers.</p>
            <span className="text-xs text-gray-500 mt-2 block">2 hours ago</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const Settings: React.FC = () => (
  <div className="animate-fade-in space-y-6">
    <h1 className="text-3xl font-display font-bold text-white">Account Settings</h1>
    <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#334155]">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-lg">
          JD
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">John Doe</h2>
          <p className="text-gray-400">john.doe@example.com</p>
          <button className="mt-3 px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg text-sm transition-colors">Change Avatar</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Full Name</label>
          <input type="text" className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500" defaultValue="John Doe" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email Address</label>
          <input type="email" className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" defaultValue="john.doe@example.com" disabled />
        </div>
      </div>
      
      <button className="mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-500/20">
        Save Changes
      </button>
    </div>
  </div>
);
