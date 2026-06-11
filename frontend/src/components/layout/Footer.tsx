import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-dark-bg border-t border-gray-800 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <FaRecycle className="text-white text-xl" />
              </div>
              <span className="text-xl font-display font-bold text-white">
                Eco<span className="text-primary-400">Waste</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered smart waste management platform making cities cleaner and greener through technology and community participation.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FaTwitter, label: 'Twitter' },
                { Icon: FaGithub, label: 'GitHub' },
                { Icon: FaLinkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  title={label}
                  aria-label={label}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-500/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {['Home', 'About', 'Recycling Centers', 'Analytics', 'Contact'].map((link) => (
                <Link
                  key={link}
                  to={`/${link.toLowerCase().replace(/ /g, '-')}`}
                  className="block text-gray-400 hover:text-primary-400 text-sm transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <div className="space-y-3">
              {['Waste Classification', 'Route Optimization', 'Complaint System', 'Recycling Rewards', 'Real-time Tracking'].map((item) => (
                <p key={item} className="text-gray-400 text-sm">{item}</p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 text-sm transition-colors">
                <FiMail size={16} />
                support@ecowaste.io
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 text-sm transition-colors">
                <FiPhone size={16} />
                +1 (555) 123-4567
              </a>
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <FiMapPin size={16} className="mt-0.5 shrink-0" />
                <span>123 Green Street, Eco City, Earth 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} EcoWaste. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
