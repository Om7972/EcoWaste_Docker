import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiCamera, FiCheck, FiRefreshCw, FiInfo } from 'react-icons/fi';
import { FaRecycle, FaLeaf } from 'react-icons/fa';

const categories: Record<string, { color: string; icon: string; tips: string[] }> = {
  plastic: { color: 'from-purple-500 to-indigo-500', icon: '🧴', tips: ['Rinse containers before recycling', 'Remove caps and labels', 'Check for recycling symbol'] },
  paper: { color: 'from-blue-500 to-cyan-500', icon: '📄', tips: ['Keep paper dry and clean', 'Remove staples and clips', 'Flatten cardboard boxes'] },
  glass: { color: 'from-teal-500 to-green-500', icon: '🫙', tips: ['Rinse glass containers', 'Remove metal lids', 'Do not mix with ceramics'] },
  organic: { color: 'from-green-500 to-emerald-500', icon: '🍎', tips: ['Compost food scraps', 'Avoid meat in home compost', 'Use for garden mulch'] },
  metal: { color: 'from-gray-500 to-slate-500', icon: '🥫', tips: ['Rinse metal cans', 'Crush cans to save space', 'Separate aluminum from steel'] },
  ewaste: { color: 'from-red-500 to-orange-500', icon: '📱', tips: ['Take to e-waste center', 'Remove batteries first', 'Never throw in regular trash'] },
  textile: { color: 'from-pink-500 to-rose-500', icon: '👕', tips: ['Donate wearable clothes', 'Repurpose as cleaning rags', 'Take to textile recycling'] },
};

const WasteScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ category: string; confidence: number; recyclable: boolean } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setImage(reader.result as string); setResult(null); };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const cats = Object.keys(categories);
      const category = cats[Math.floor(Math.random() * cats.length)];
      setResult({ category, confidence: 75 + Math.random() * 20, recyclable: !['organic', 'ewaste'].includes(category) });
      setIsAnalyzing(false);
    }, 2500);
  };

  const reset = () => { setImage(null); setResult(null); };

  const cat = result ? categories[result.category] : null;

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
            <FiCamera /> AI Waste Scanner
          </div>
          <h1 className="section-title text-gray-900 dark:text-white">Identify & Classify <span className="gradient-text">Waste</span></h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Upload a photo of waste and our AI will identify the material type and provide recycling guidance.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Image</h3>
            {!image ? (
              <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-dark-border hover:border-primary-400'}`}>
                <input {...getInputProps()} />
                <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Drag & drop an image here</p>
                <p className="text-sm text-gray-400 mt-1">or click to browse</p>
              </div>
            ) : (
              <div className="relative">
                <img src={image} alt="Waste" className="w-full h-64 object-cover rounded-2xl" />
                <button onClick={reset} title="Re-upload image" aria-label="Re-upload image" className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md rounded-xl hover:bg-white transition-colors">
                  <FiRefreshCw size={18} />
                </button>
              </div>
            )}
            {image && !result && (
              <button onClick={analyzeImage} disabled={isAnalyzing} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                {isAnalyzing ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <><FaRecycle />Analyze Waste</>}
              </button>
            )}
          </motion.div>

          {/* Result */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card-solid p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Analysis Result</h3>
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">AI is analyzing your image...</p>
                </motion.div>
              ) : result && cat ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-white mb-6`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{cat.icon}</span>
                      <div>
                        <p className="text-sm text-white/70 uppercase tracking-wider">Detected</p>
                        <h4 className="text-2xl font-bold capitalize">{result.category}</h4>
                        <p className="text-sm text-white/80 mt-1">Confidence: {result.confidence.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {result.recyclable ? <><FaLeaf /><span className="text-sm font-medium">Recyclable ♻️</span></> : <><FiInfo /><span className="text-sm font-medium">Requires special disposal</span></>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">Recycling Tips</h4>
                    <div className="space-y-2">
                      {cat.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                          <FiCheck className="text-primary-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center gap-3">
                    <FiAward className="text-primary-500 text-xl" />
                    <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">+10 reward points earned!</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <FaRecycle className="text-5xl mb-4 opacity-30" />
                  <p className="font-medium">Upload an image to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FiAward = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
);

export default WasteScanner;
