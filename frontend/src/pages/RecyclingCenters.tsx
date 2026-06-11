import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMapPin, FiClock, FiPhone, FiStar, FiSearch, FiFilter, FiNavigation } from 'react-icons/fi';

// Custom Map Marker Icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultCenter: [number, number] = [40.7128, -74.0060]; // New York

const initialCenters = [
  { id: 1, name: 'Green Earth Recycling Center', address: '123 Green St, Eco City', materials: ['Plastic', 'Paper', 'Glass'], hours: '8:00 AM - 6:00 PM', phone: '+1 555-0101', rating: 4.8, isOpen: true, lat: 40.7128, lng: -74.006 },
  { id: 2, name: 'EcoHub Waste Solutions', address: '456 Recycle Ave, Green Town', materials: ['Metal', 'E-waste', 'Textiles'], hours: '9:00 AM - 5:00 PM', phone: '+1 555-0102', rating: 4.5, isOpen: true, lat: 40.7228, lng: -73.996 },
  { id: 3, name: 'City Central Recycling', address: '789 Sustain Blvd, Eco City', materials: ['Plastic', 'Paper', 'Metal', 'Glass'], hours: '7:00 AM - 8:00 PM', phone: '+1 555-0103', rating: 4.9, isOpen: true, lat: 40.7328, lng: -74.016 },
  { id: 4, name: 'GreenWave Collection Point', address: '321 Ocean Dr, Beach Town', materials: ['Organic', 'Paper', 'Plastic'], hours: '10:00 AM - 4:00 PM', phone: '+1 555-0104', rating: 4.2, isOpen: false, lat: 40.7028, lng: -73.986 },
  { id: 5, name: 'TechRecycle Hub', address: '654 Circuit Ln, Tech Park', materials: ['E-waste', 'Batteries', 'Electronics'], hours: '9:00 AM - 7:00 PM', phone: '+1 555-0105', rating: 4.7, isOpen: true, lat: 40.7428, lng: -74.026 },
  { id: 6, name: 'Community Green Center', address: '987 Park Rd, Eco City', materials: ['Plastic', 'Glass', 'Metal', 'Textiles'], hours: '8:00 AM - 5:00 PM', phone: '+1 555-0106', rating: 4.6, isOpen: true, lat: 40.7178, lng: -74.016 },
];

const allMaterials = Array.from(new Set(initialCenters.flatMap(c => c.materials)));

// Component to dynamically fly to selected marker
const MapFlyTo = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.flyTo(center, 14, { duration: 1.5 });
  return null;
};

const RecyclingCenters: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [activeCenter, setActiveCenter] = useState<[number, number] | null>(null);

  const filteredCenters = useMemo(() => {
    return initialCenters.filter(center => {
      const matchesSearch = center.name.toLowerCase().includes(search.toLowerCase()) || 
                            center.address.toLowerCase().includes(search.toLowerCase());
      const matchesMaterial = selectedMaterial === 'All' || center.materials.includes(selectedMaterial);
      const matchesOpen = showOpenOnly ? center.isOpen : true;
      return matchesSearch && matchesMaterial && matchesOpen;
    });
  }, [search, selectedMaterial, showOpenOnly]);

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="glass-card-solid p-6 rounded-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Interactive Map & Locator</h1>
            <p className="text-gray-400">Find the nearest facilities to recycle your waste properly.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search centers..." 
                className="pl-10 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white focus:outline-none focus:border-primary-500 w-full sm:w-64 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                title="Filter by material type"
                aria-label="Filter by material type"
                className="pl-10 pr-8 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-white appearance-none focus:outline-none focus:border-primary-500 w-full sm:w-48 cursor-pointer"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option value="All">All Materials</option>
                {allMaterials.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[#0f172a] px-4 py-3 border border-[#334155] rounded-xl text-white hover:border-primary-500 transition-colors">
              <input 
                type="checkbox" 
                checked={showOpenOnly}
                onChange={(e) => setShowOpenOnly(e.target.checked)}
                className="w-4 h-4 rounded text-primary-500 focus:ring-primary-500 focus:ring-offset-[#0f172a] bg-[#1e293b] border-[#334155]"
              />
              Open Now
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[700px]">
        {/* Map Section */}
        <div className="xl:col-span-2 glass-card-solid rounded-3xl overflow-hidden relative z-0 border border-[#334155]/50 shadow-xl shadow-black/20">
          <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {filteredCenters.map(center => (
              <Marker 
                key={center.id} 
                position={[center.lat, center.lng]} 
                icon={customIcon}
                eventHandlers={{
                  click: () => setActiveCenter([center.lat, center.lng])
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{center.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1"><FiMapPin />{center.address}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {center.materials.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-[10px] font-bold uppercase">{m}</span>
                      ))}
                    </div>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full block text-center py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
            {activeCenter && <MapFlyTo center={activeCenter} />}
          </MapContainer>
        </div>

        {/* List Section */}
        <div className="glass-card-solid p-6 rounded-3xl flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Results ({filteredCenters.length})</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {filteredCenters.length > 0 ? filteredCenters.map((center, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={center.id} 
                  className="bg-[#0f172a] border border-[#334155] hover:border-primary-500/50 p-5 rounded-2xl cursor-pointer group transition-all"
                  onClick={() => setActiveCenter([center.lat, center.lng])}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors pr-2 leading-tight">{center.name}</h4>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase shrink-0 ${center.isOpen ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {center.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-400 flex items-start gap-2">
                      <FiMapPin className="mt-1 shrink-0 text-gray-500" />
                      <span className="line-clamp-1">{center.address}</span>
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <FiClock className="shrink-0 text-gray-500" /> {center.hours}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <p className="flex items-center gap-2"><FiPhone className="text-gray-500" /> {center.phone}</p>
                      <p className="flex items-center gap-1 text-amber-400 font-medium"><FiStar fill="currentColor" /> {center.rating}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#334155]">
                    {center.materials.map(m => (
                      <span key={m} className="px-2 py-1 bg-[#1e293b] rounded-lg text-xs font-medium text-gray-300 border border-[#334155]">{m}</span>
                    ))}
                  </div>
                </motion.div>
              )) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#334155] rounded-2xl">
                  <FiMapPin className="text-4xl text-gray-500 mb-4" />
                  <p className="text-white font-medium mb-1">No centers found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters or search query.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclingCenters;
