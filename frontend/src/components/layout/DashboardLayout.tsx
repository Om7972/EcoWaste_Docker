import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiFileText, FiCamera, FiMapPin, FiBarChart2, FiAward, FiBell, FiSettings, FiLogOut, FiMenu, FiX, FiGlobe, FiCpu, FiCompass } from 'react-icons/fi';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { icon: FiHome, label: 'Overview', path: '/dashboard', exact: true },
    { icon: FiCpu, label: 'Smart Bins', path: '/dashboard/smart-bins' },
    { icon: FiCompass, label: 'Ecosystem', path: '/dashboard/sustainability' },
    { icon: FiFileText, label: 'Complaints', path: '/dashboard/complaints' },
    { icon: FiCamera, label: 'AI Scanner', path: '/dashboard/scanner' },
    { icon: FiMapPin, label: 'Map', path: '/dashboard/map' },
    { icon: FiBarChart2, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: FiAward, label: 'Rewards', path: '/dashboard/rewards' },
    { icon: FiBell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 flex font-sans">
      {/* Sidebar matching screenshot */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#1e293b] border-r border-[#334155] z-40 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="flex items-center justify-between md:hidden mb-6 px-2">
            <span className="font-bold text-white text-xl tracking-wide">Menu</span>
            <button onClick={() => setSidebarOpen(false)} title="Close menu" aria-label="Close menu" className="text-gray-400 hover:text-white"><FiX size={24} /></button>
          </div>

          {/* Home / Landing Page Link */}
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[15px] text-gray-400 hover:bg-[#334155]/50 hover:text-gray-200 mb-4 border-b border-[#334155] pb-4"
          >
            <FiGlobe size={20} />
            Back to Home
          </Link>
          
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[15px] ${
                    isActive
                      ? 'bg-[#10b981]/10 text-[#34d399]'
                      : 'text-gray-400 hover:bg-[#334155]/50 hover:text-gray-200'
                  }`
                }
              >
                <link.icon size={20} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-[#334155]">
          <button onClick={logout} className="flex w-full items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[15px] text-gray-400 hover:bg-red-500/10 hover:text-red-400">
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-auto bg-[#0f172a]">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8 md:hidden">
            <button onClick={() => setSidebarOpen(true)} title="Open menu" aria-label="Open menu" className="p-2 bg-[#1e293b] rounded-lg text-gray-300">
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">EcoWaste</h1>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
