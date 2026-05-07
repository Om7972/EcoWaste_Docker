import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiPhone, FiStar } from 'react-icons/fi';

const centers = [
  { id: 1, name: 'Green Earth Recycling Center', address: '123 Green St, Eco City', materials: ['Plastic', 'Paper', 'Glass'], hours: '8:00 AM - 6:00 PM', phone: '+1 555-0101', rating: 4.8, isOpen: true, lat: 40.7128, lng: -74.006 },
  { id: 2, name: 'EcoHub Waste Solutions', address: '456 Recycle Ave, Green Town', materials: ['Metal', 'E-waste', 'Textiles'], hours: '9:00 AM - 5:00 PM', phone: '+1 555-0102', rating: 4.5, isOpen: true, lat: 40.7228, lng: -73.996 },
  { id: 3, name: 'City Central Recycling', address: '789 Sustain Blvd, Eco City', materials: ['Plastic', 'Paper', 'Metal', 'Glass'], hours: '7:00 AM - 8:00 PM', phone: '+1 555-0103', rating: 4.9, isOpen: true, lat: 40.7328, lng: -74.016 },
  { id: 4, name: 'GreenWave Collection Point', address: '321 Ocean Dr, Beach Town', materials: ['Organic', 'Paper', 'Plastic'], hours: '10:00 AM - 4:00 PM', phone: '+1 555-0104', rating: 4.2, isOpen: false, lat: 40.7028, lng: -73.986 },
  { id: 5, name: 'TechRecycle Hub', address: '654 Circuit Ln, Tech Park', materials: ['E-waste', 'Batteries', 'Electronics'], hours: '9:00 AM - 7:00 PM', phone: '+1 555-0105', rating: 4.7, isOpen: true, lat: 40.7428, lng: -74.026 },
  { id: 6, name: 'Community Green Center', address: '987 Park Rd, Eco City', materials: ['Plastic', 'Glass', 'Metal', 'Textiles'], hours: '8:00 AM - 5:00 PM', phone: '+1 555-0106', rating: 4.6, isOpen: true, lat: 40.7178, lng: -74.016 },
];

const RecyclingCenters: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Find Nearby</span>
          <h1 className="section-title mt-2 text-gray-900 dark:text-white">Recycling <span className="gradient-text">Centers</span></h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Locate recycling centers near you and check what materials they accept.</p>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card-solid p-1 mb-8 overflow-hidden">
          <div className="w-full h-[400px] bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="mx-auto text-5xl text-primary-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Interactive Map</h3>
              <p className="text-gray-500">Map loads with Leaflet when API keys are configured</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {centers.filter(c => c.isOpen).map(c => (
                  <span key={c.id} className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
                    📍 {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center, i) => (
            <motion.div key={center.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -5 }} className="glass-card-solid p-6 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{center.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FiMapPin size={14} />{center.address}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${center.isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {center.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {center.materials.map(m => (
                  <span key={m} className="px-2 py-0.5 bg-gray-100 dark:bg-dark-bg rounded-lg text-xs text-gray-600 dark:text-gray-400">{m}</span>
                ))}
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2"><FiClock size={14} />{center.hours}</p>
                <p className="flex items-center gap-2"><FiPhone size={14} />{center.phone}</p>
                <p className="flex items-center gap-2"><FiStar size={14} className="text-amber-500" /><span className="text-gray-900 dark:text-white font-medium">{center.rating}</span>/5.0</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecyclingCenters;
