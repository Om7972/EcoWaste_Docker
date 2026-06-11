import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiMap, FiShield, FiAward, FiBarChart2, FiCpu, FiGlobe, FiStar, FiCheckCircle } from 'react-icons/fi';

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.15 } },
  viewport: { once: true, margin: "-100px" }
};

const Landing: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    { icon: FiCpu, title: 'AI Waste Classification', desc: 'Instantly identify waste types with our 99% accurate AI scanner and get precise recycling guidance.', color: 'from-purple-600 to-indigo-600', badge: 'New AI Model' },
    { icon: FiMap, title: 'Smart Route Optimization', desc: 'Reduce carbon emissions and fuel costs by up to 30% with dynamic, AI-planned collection routes.', color: 'from-blue-600 to-cyan-600' },
    { icon: FiBarChart2, title: 'Real-time Analytics', desc: 'Make data-driven decisions with comprehensive dashboards, predictive modeling, and automated reporting.', color: 'from-emerald-500 to-teal-600' },
    { icon: FiAward, title: 'Recycling Rewards', desc: 'Gamify sustainability. Earn points for verified recycling and redeem them at local eco-friendly businesses.', color: 'from-amber-500 to-orange-600', badge: 'Popular' },
    { icon: FiShield, title: 'Complaint Tracking', desc: 'Report issues instantly with geo-tagging and track resolution status in real-time through a transparent portal.', color: 'from-rose-500 to-pink-600' },
    { icon: FiGlobe, title: 'Recycling Center Locator', desc: 'Find specialized recycling facilities near you with live capacity status and accepted materials lists.', color: 'from-teal-500 to-green-600' },
  ];

  return (
    <div className="overflow-hidden bg-[#0a0f1c]">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[120px]" />
          <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_10px_#22c55e]" />
              <span className="text-sm font-medium text-gray-300 tracking-wide">Introducing EcoWaste V2.0</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-display font-bold text-white leading-[1.1] tracking-tight">
              Smarter Cities.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-emerald-300 to-cyan-400">
                Cleaner Future.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
              Transform urban waste management with AI-powered classification, dynamic route optimization, and community-driven rewards.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link to="/register" className="group relative px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_#22c55e] hover:shadow-[0_0_60px_-15px_#22c55e] hover:-translate-y-1 flex items-center gap-3 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Start Free Trial <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </Link>
              <Link to="/about" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-semibold rounded-2xl transition-all duration-300 backdrop-blur-md hover:-translate-y-1">
                Book a Demo
              </Link>
            </div>

            <div className="pt-16 flex items-center justify-center gap-8 text-gray-500">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0a0f1c] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs text-white font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-1 text-amber-400 mb-1"><FiStar fill="currentColor"/><FiStar fill="currentColor"/><FiStar fill="currentColor"/><FiStar fill="currentColor"/><FiStar fill="currentColor"/></div>
                <p className="text-sm font-medium text-gray-300">Trusted by 500+ municipalities</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* Premium Features */}
      <section className="py-32 relative z-20 bg-[#0f172a]/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Everything you need to <br/>scale sustainability</h2>
            <p className="text-xl text-gray-400">An end-to-end platform designed for citizens, collectors, and city administrators.</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="group relative bg-[#1e293b]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-[#1e293b] transition-colors duration-500">
                {feature.badge && (
                  <span className="absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {feature.badge}
                  </span>
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{feature.desc}</p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-primary-400 transition-colors cursor-pointer">
                  Learn more <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Big Impact Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                Real impact.<br/>
                Measurable results.
              </h2>
              <p className="text-xl text-gray-400">
                EcoWaste isn't just software—it's a catalyst for environmental change. Our platform provides the tools needed to drastically reduce landfill waste and optimize city resources.
              </p>
              <ul className="space-y-6">
                {[
                  'Increase recycling rates by up to 40%',
                  'Reduce collection truck mileage by 30%',
                  'Resolve citizen complaints 3x faster'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                      <FiCheckCircle />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div {...fadeInUp} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-blue-500/20 blur-3xl rounded-full" />
              <div className="relative bg-[#1e293b]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: '2M+', label: 'Tons Recycled' },
                    { value: '150+', label: 'Partner Cities' },
                    { value: '500K', label: 'Active Users' },
                    { value: '98%', label: 'Satisfaction' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
                      <h4 className="text-4xl font-display font-bold text-white mb-2">{stat.value}</h4>
                      <p className="text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp} className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-[3rem] p-16 relative overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.3)] border border-white/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white">Ready to transform your city?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">Join the growing network of municipalities using EcoWaste to build a sustainable future.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link to="/register" className="px-10 py-5 bg-white text-primary-700 hover:bg-gray-50 text-xl font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
