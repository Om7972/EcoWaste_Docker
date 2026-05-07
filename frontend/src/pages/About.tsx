import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiGlobe, FiAward, FiHeart } from 'react-icons/fi';
import { FaRecycle, FaLeaf } from 'react-icons/fa';

const About: React.FC = () => {
  const team = [
    { name: 'Sarah Chen', role: 'CEO & Founder', emoji: '👩‍💼' },
    { name: 'Marcus Johnson', role: 'CTO', emoji: '👨‍💻' },
    { name: 'Priya Patel', role: 'Head of AI', emoji: '👩‍🔬' },
    { name: 'Alex Rivera', role: 'Lead Designer', emoji: '🎨' },
  ];

  const values = [
    { icon: FiTarget, title: 'Mission-Driven', desc: 'Every feature we build is designed to reduce waste and promote sustainability.' },
    { icon: FiUsers, title: 'Community First', desc: 'We believe in empowering citizens to take ownership of their environment.' },
    { icon: FiGlobe, title: 'Global Impact', desc: 'Our solutions scale from neighborhoods to entire metropolitan areas.' },
    { icon: FiHeart, title: 'Sustainability', desc: 'We practice what we preach with carbon-neutral operations.' },
  ];

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 to-accent-600 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
              <FaRecycle className="text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About <span className="text-primary-200">EcoWaste</span></h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">We're on a mission to revolutionize urban waste management through AI-powered technology and community engagement.</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title text-gray-900 dark:text-white">Our <span className="gradient-text">Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }} className="glass-card-solid p-6 text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-primary-500 text-xl" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-dark-bg/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title text-gray-900 dark:text-white">Meet Our <span className="gradient-text">Team</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }} className="glass-card-solid p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title text-gray-900 dark:text-white">Our <span className="gradient-text">Impact</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Tons Recycled', icon: FaRecycle },
              { value: '120+', label: 'Cities', icon: FiGlobe },
              { value: '2M+', label: 'CO₂ Offset (kg)', icon: FaLeaf },
              { value: '500K+', label: 'Active Users', icon: FiUsers },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <stat.icon className="mx-auto text-3xl text-primary-500 mb-3" />
                <h3 className="text-3xl font-bold font-display text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
