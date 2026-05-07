import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FaRecycle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-accent-600 via-primary-600 to-eco-ocean relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 text-center text-white p-12 max-w-lg">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30">
              <FaRecycle className="text-5xl" />
            </div>
          </motion.div>
          <h3 className="text-3xl font-display font-bold mb-4">Join the Green Revolution</h3>
          <p className="text-white/80 text-lg">Create an account and start making a difference in your city's waste management.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md space-y-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center"><FaRecycle className="text-white text-xl" /></div>
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">Eco<span className="gradient-text">Waste</span></span>
            </Link>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create your account</h2>
            <p className="mt-2 text-gray-500">Join the smart waste management platform</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field-solid !pl-11" placeholder="Enter your name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field-solid !pl-11" placeholder="Enter your email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="register-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field-solid !pl-11 !pr-11" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><FiEye /></button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {['citizen', 'admin', 'collector'].map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${role === r ? 'bg-primary-500 text-white shadow-neon-green' : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button id="register-submit" type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><FiArrowRight /></>}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-primary-500 font-semibold">Sign in</Link></p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
