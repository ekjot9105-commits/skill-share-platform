import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import api from '../api';
import type { WorkerProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, RefreshCcw } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [activeFilter, setActiveFilter] = useState('All'); // All, Money, Barter, Local, Online


  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/workers');
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to map categories to vibrant card styles
  const getCategoryStyle = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('tech') || cat.includes('web') || cat.includes('dev')) return { bg: 'bg-[#bee3f8] dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-300', icon: '💻', tag: 'TECHNOLOGY' };
    if (cat.includes('design') || cat.includes('art')) return { bg: 'bg-[#fed7d7] dark:bg-red-900/40', text: 'text-red-500 dark:text-red-300', icon: '🎨', tag: 'DESIGN' };
    if (cat.includes('music') || cat.includes('piano') || cat.includes('tutor')) return { bg: 'bg-[#e9d8fd] dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-300', icon: '🎵', tag: 'MUSIC / EDU' };
    if (cat.includes('plumb') || cat.includes('elect') || cat.includes('clean') || cat.includes('carpentry')) return { bg: 'bg-[#c6f6d5] dark:bg-green-900/40', text: 'text-green-600 dark:text-green-300', icon: '🔧', tag: 'MAINTENANCE' };
    if (cat.includes('lang') || cat.includes('speak') || cat.includes('coach')) return { bg: 'bg-[#fed7e2] dark:bg-pink-900/40', text: 'text-pink-600 dark:text-pink-300', icon: '🗣️', tag: 'LANGUAGE' };
    if (cat.includes('photo') || cat.includes('video')) return { bg: 'bg-[#e2e8f0] dark:bg-slate-800/60', text: 'text-slate-600 dark:text-slate-300', icon: '📸', tag: 'MEDIA' };
    return { bg: 'bg-[#fefcbf] dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-300', icon: '✨', tag: 'OTHER' };
  };

  let filteredWorkers = workers.filter(w => {
    const target = searchQuery.toLowerCase();
    const searchMatch = !target || w.name.toLowerCase().includes(target) || w.category.toLowerCase().includes(target) || w.skills.some(s => s.toLowerCase().includes(target));
    return searchMatch;
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 pb-20">
      
      {/* Top White Header Section */}
      <div className="bg-[#fffcf8] dark:bg-background-dark px-4 md:px-12 pt-8 pb-10 transition-colors">
        <div className="mb-6"><BackButton /></div>
        <div className="flex items-center justify-between mb-10">
           <Link to="/" className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
             <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
             SkillBridge
           </Link>
           <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
             <Link to="/" className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">How it Works</Link>
             <Link to="/search" className="text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-1">Explore</Link>
             <Link to="/search" className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">Barter</Link>
             <Link to="/" className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">Community</Link>
           </nav>
           <div className="flex gap-4">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition drop-shadow-sm bg-white text-slate-700">Log In</Link>
              <Link to="/signup" className="px-5 py-2.5 text-sm font-bold bg-[#1e293b] text-white rounded-lg hover:bg-slate-800 transition shadow-md">Get Started</Link>
           </div>
        </div>

        {/* Search Bar Wrapper */}
        <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-full bg-white dark:bg-surface-dark flex items-center rounded-2xl p-2 border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
               <input 
                 type="text" 
                 placeholder="Search skills, topics, people..." 
                 className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-800 dark:text-white font-medium placeholder-slate-400"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <button className="bg-[#f59e0b] hover:bg-amber-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-md">Search</button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
               <button onClick={() => setActiveFilter('All')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeFilter === 'All' ? 'bg-[#1e293b] dark:bg-primary-dark text-white' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm'}`}>All Skills</button>
               <button onClick={() => setActiveFilter('Money')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeFilter === 'Money' ? 'bg-white dark:bg-surface-dark border-amber-500 ring-2 ring-amber-100 dark:ring-amber-900/30' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'} shadow-sm hover:border-amber-500`}><span className="text-amber-500">💰</span> For Money</button>
               <button onClick={() => setActiveFilter('Barter')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeFilter === 'Barter' ? 'bg-white dark:bg-surface-dark border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/30' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'} shadow-sm hover:border-blue-500`}><RefreshCcw className="w-4 h-4 text-blue-500"/> Barter Only</button>
               <button onClick={() => setActiveFilter('Local')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeFilter === 'Local' ? 'bg-white dark:bg-surface-dark border-pink-500 ring-2 ring-pink-100 dark:ring-pink-900/30' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'} shadow-sm hover:border-pink-500`}><MapPin className="w-4 h-4 text-pink-500"/> Local</button>
               <button onClick={() => setActiveFilter('Online')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeFilter === 'Online' ? 'bg-white dark:bg-surface-dark border-cyan-500 ring-2 ring-cyan-100 dark:ring-cyan-900/30' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'} shadow-sm hover:border-cyan-500`}><Globe className="w-4 h-4 text-cyan-500"/> Online</button>
            </div>
        </div>
      </div>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[2rem] h-[400px] border border-slate-100 shadow-sm flex flex-col">
                 <div className="h-48 bg-slate-100 rounded-t-[2rem]"></div>
                 <div className="p-6 flex-1 flex flex-col gap-3">
                    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredWorkers.map((worker) => {
                const style = getCategoryStyle(worker.category);
                
                // MOCK determiner since backend doesn't output exact barter flag easily
                // Half barter half money visually for effect
                const isBarter = worker.id % 2 !== 0; 
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    key={worker.id}
                  >
                    <Link to={`/worker/${worker.id}`} className="block group bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                       
                       {/* Top Vibrant Half */}
                       <div className={`${style.bg} h-48 flex items-center justify-center relative overflow-hidden transition-colors`}>
                          <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                          <span className="text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">{style.icon}</span>
                       </div>

                       {/* Bottom Content Half */}
                       <div className="p-6 flex flex-col flex-1">
                          
                          {/* Tags Top Row */}
                          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest">
                             <span className={`${style.text}`}>{style.tag}</span>
                             {isBarter ? (
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 flex items-center gap-1.5 rounded-lg border border-blue-100"><RefreshCcw className="w-3 h-3"/> Barter</span>
                             ) : (
                                <span className="bg-amber-50 text-amber-600 px-3 py-1 flex items-center gap-1.5 rounded-lg border border-amber-100">💰 Money</span>
                             )}
                          </div>

                          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-amber-500 transition-colors line-clamp-1">{worker.category}</h3>
                          
                          <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 line-clamp-2 flex-1">
                             {worker.bio || `Build modern capabilities inside of the ${worker.category} field. From concept to deployment with best practices.`}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                              <p className="font-extrabold text-slate-800 dark:text-white text-lg">
                                {isBarter ? (
                                  <span className="flex items-center gap-1.5 text-sm text-blue-600"><RefreshCcw className="w-4 h-4"/> Swap offer</span>
                                ) : (
                                  <span>${worker.hourly_rate} <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">/hr</span></span>
                                )}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-600">{worker.name.split(' ')[0]} {(worker.name.split(' ')[1] || '')[0]}.</span>
                                <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shadow-sm border border-white">
                                   <img src={worker.avatar_url || 'https://i.pravatar.cc/150'} alt={worker.name} className="w-full h-full object-cover" />
                                </div>
                              </div>
                          </div>
                          
                       </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

    </div>
  );
}
