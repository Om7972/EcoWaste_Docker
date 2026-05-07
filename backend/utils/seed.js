const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const RecyclingCenter = require('../models/RecyclingCenter');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecowaste');
  console.log('Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany();
  await RecyclingCenter.deleteMany();

  // Create users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@ecowaste.io', password: 'demo123456', role: 'admin', rewardPoints: 5000 },
    { name: 'John Citizen', email: 'citizen@ecowaste.io', password: 'demo123456', role: 'citizen', rewardPoints: 2450 },
    { name: 'Mike Collector', email: 'collector@ecowaste.io', password: 'demo123456', role: 'collector', rewardPoints: 1200 },
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Create recycling centers
  const centers = await RecyclingCenter.create([
    { name: 'Green Earth Recycling', address: '123 Green St, Eco City', location: { type: 'Point', coordinates: [-74.006, 40.7128] }, acceptedMaterials: ['Plastic', 'Paper', 'Glass'], operatingHours: '8:00 AM - 6:00 PM', phone: '+1 555-0101', rating: 4.8, isOpen: true },
    { name: 'EcoHub Waste Solutions', address: '456 Recycle Ave, Green Town', location: { type: 'Point', coordinates: [-73.996, 40.7228] }, acceptedMaterials: ['Metal', 'E-waste', 'Textiles'], operatingHours: '9:00 AM - 5:00 PM', phone: '+1 555-0102', rating: 4.5, isOpen: true },
    { name: 'City Central Recycling', address: '789 Sustain Blvd', location: { type: 'Point', coordinates: [-74.016, 40.7328] }, acceptedMaterials: ['Plastic', 'Paper', 'Metal', 'Glass'], operatingHours: '7:00 AM - 8:00 PM', phone: '+1 555-0103', rating: 4.9, isOpen: true },
    { name: 'TechRecycle Hub', address: '654 Circuit Ln, Tech Park', location: { type: 'Point', coordinates: [-74.026, 40.7428] }, acceptedMaterials: ['E-waste', 'Batteries', 'Electronics'], operatingHours: '9:00 AM - 7:00 PM', phone: '+1 555-0105', rating: 4.7, isOpen: true },
  ]);
  console.log(`✅ Created ${centers.length} recycling centers`);

  console.log('\n🌱 Seed completed successfully!');
  console.log('\nDemo Login Credentials:');
  console.log('  Admin:     admin@ecowaste.io / demo123456');
  console.log('  Citizen:   citizen@ecowaste.io / demo123456');
  console.log('  Collector: collector@ecowaste.io / demo123456');
  process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
