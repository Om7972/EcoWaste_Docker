import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiMenu, FiX, FiSun, FiMoon, FiBell, FiUser,
  FiLogOut, FiHome, FiMapPin, FiBarChart2, FiInfo
} from 'react-icons/fi';
import { FaRecycle } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/recycling-centers', label: 'Recycling Centers', icon: FiMapPin },
    { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
    { path: '/about', label: 'About', icon: FiInfo },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLanding
          ? 'bg-transparent backdrop-blur-md'
          : 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-dark-border/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-neon-green"
            >
              <FaRecycle className="text-white text-xl" />
            </motion.div>
            <span className={`text-xl font-display font-bold ${
              isLanding ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Eco<span className="gradient-text">Waste</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : isLanding
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-card'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors ${
                isLanding
                  ? 'text-white/80 hover:bg-white/10'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'
              }`}
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </motion.button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  to="/dashboard"
                  className={`p-2.5 rounded-xl relative transition-colors ${
                    isLanding
                      ? 'text-white/80 hover:bg-white/10'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card'
                  }`}
                >
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-bg" />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className={`hidden lg:block text-sm font-medium ${
                      isLanding ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {user?.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                          <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full font-medium capitalize">
                              {user?.role}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-eco-sun/10 text-eco-sun rounded-full font-medium">
                              ⭐ {user?.rewardPoints || 0} pts
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-sm"
                          >
                            <FiUser size={16} />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => { logout(); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                          >
                            <FiLogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isLanding
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card'
                  }`}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2.5 rounded-xl ${
                isLanding ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center btn-primary">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
