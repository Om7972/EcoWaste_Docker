import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'support@ecowaste.io', color: 'from-blue-500 to-cyan-500' },
    { icon: FiPhone, label: 'Phone', value: '+1 (555) 123-4567', color: 'from-green-500 to-emerald-500' },
    { icon: FiMapPin, label: 'Address', value: '123 Green Street, Eco City 10001', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="page-container">
      <section className="relative py-24 bg-gradient-to-br from-accent-600 to-eco-ocean overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Get in <span className="text-accent-200">Touch</span></h1>
            <p className="text-white/80 text-lg">Have questions? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }} className="glass-card-solid p-6 text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{info.label}</h3>
                <p className="text-gray-500 text-sm">{info.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto glass-card-solid p-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                  <input id="contact-name" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="input-field-solid" placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input id="contact-email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="input-field-solid" placeholder="Your email" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                <input id="contact-subject" type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  className="input-field-solid" placeholder="Message subject" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                <textarea id="contact-message" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="input-field-solid resize-none" placeholder="Your message" required />
              </div>
              <button id="contact-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSend />Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
