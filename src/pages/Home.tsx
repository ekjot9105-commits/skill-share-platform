import { useState, useEffect } from 'react';
import { categories } from '../data/mockData';
import { Star, MapPin, Search, Wrench, Zap, BookOpen, Sparkles, Briefcase, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { useTranslation } from 'react-i18next';
import api from '../api';
import type { WorkerProfile } from '../types';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleOnHover } from '../utils/animations';

export function Home() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/workers').then(res => {
      setWorkers(res.data.slice(0, 6)); // Top 6
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getCategoryIcon = (name: string) => {
      switch (name.toLowerCase()) {
          case 'plumber': return <Wrench className="w-8 h-8" />;
          case 'electrician': return <Zap className="w-8 h-8" />;
          case 'tutor': return <BookOpen className="w-8 h-8" />;
          case 'cleaner': return <Sparkles className="w-8 h-8" />;
          default: return <Briefcase className="w-8 h-8" />;
      }
  };

  const handleAiMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt) return;
    setIsAiLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      setIsAiLoading(false);
      // Route to search page with AI prefilled generic payload
      navigate(`/search?ai_match=${encodeURIComponent(aiPrompt)}`);
    }, 1500);
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="flex flex-col gap-8 p-4 md:p-0 transition-colors duration-300"
    >
      <div className="mt-2"><BackButton /></div>
      
      {/* Hero Section */}
      <motion.section 
        variants={fadeInUp()}
        className="bg-slate-900 dark:bg-surface-dark text-white rounded-3xl p-6 md:p-12 shadow-2xl mt-0 flex flex-col items-center text-center gap-6 relative overflow-hidden transition-colors"
      >
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=2070&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-surface-dark via-slate-900/60 to-transparent"></div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight z-10 drop-shadow-md">
          {t('Find Elite Local Workers, Fast.')}
        </h1>
        <p className="text-lg md:text-xl text-slate-200 dark:text-slate-300 max-w-2xl z-10 drop-shadow-md">
          {t('From plumbing to tutoring, book verified professionals in your community instantly.')}
        </p>
        
        {/* Search Bar */}
        <div className="w-full max-w-3xl bg-white/20 backdrop-blur-md p-2 rounded-full shadow-2xl flex items-center gap-2 z-10 mt-4 border border-white/20 focus-within:bg-white/30 transition-all">
          <Search className="w-6 h-6 text-white/80 ml-4" />
          <input 
            type="text" 
            placeholder={t('What help do you need?')}
            className="flex-1 bg-transparent border-none focus:outline-none text-lg px-2 text-white placeholder-white/80"
            onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/search?q=${e.currentTarget.value}`);
            }}
          />
          <button className="bg-primary dark:bg-primary-dark text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            {t('Search')}
          </button>
        </div>
      </motion.section>

      {/* AI Recommendation CTA */}
      <motion.section 
        variants={fadeInUp(0.1)}
        className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-purple-200 dark:border-purple-800 transition-colors"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-1">{t('Not sure who to hire?')}</h2>
            <p className="text-indigo-700 dark:text-indigo-400">{t('Describe your problem, and our AI will suggest the perfect skill match.')}</p>
          </div>
        </div>
        <form onSubmit={handleAiMatch} className="flex gap-2 w-full">
            <input 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. My sink is leaking water everywhere and I need it fixed fast..."
                className="flex-1 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-surface-dark focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors text-slate-900 dark:text-slate-100"
            />
            <button 
                type="submit" 
                disabled={isAiLoading}
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 transition-all"
            >
              {isAiLoading ? t('Analyzing...') : t('Try AI Match')}
            </button>
        </form>
      </motion.section>

      {/* Categories */}
      <motion.section variants={fadeInUp(0.2)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('Categories')}</h2>
          <button className="text-primary dark:text-primary-dark font-medium">{t('See all')}</button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <motion.div key={cat.id} {...scaleOnHover}>
              <Link to={`/search?category=${cat.name}`} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="bg-white dark:bg-surface-dark shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-primary dark:group-hover:bg-primary-dark group-hover:-translate-y-1 group-hover:shadow-lg group-hover:text-white transition-all duration-300">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Skill Exchange Highlight Banner */}
      <motion.section 
        variants={fadeInUp(0.3)}
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer" 
        onClick={() => navigate('/search')}
      >
          <div className="flex-1">
             <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                 <RefreshCw className="w-4 h-4" /> {t('Zero Fees')}
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{t('Introducing Skill Exchange')}</h2>
             <p className="text-emerald-50 text-lg">{t('Short on cash? Barter your own skills for services. Build the local community economy together.')}</p>
          </div>
          <button className="bg-white text-emerald-700 font-extrabold py-4 px-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap">
              {t('Explore Barter Jobs')}
          </button>
      </motion.section>

      {/* Top Rated Workers */}
      <motion.section variants={fadeInUp(0.4)}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('Top Rated Near You')}</h2>
        
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl border dark:border-slate-800 p-4 flex flex-col h-48 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex-[1] space-y-3 py-1">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        ) : workers.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">No workers found. Be the first to join as a worker!</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
                <motion.div key={worker.id} {...scaleOnHover}>
                  <Link to={`/worker/${worker.id}`} className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.1)] transition-all overflow-hidden flex flex-col group h-full">
                  <div className="p-4 flex gap-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={worker.avatar_url || 'https://i.pravatar.cc/150'} alt={worker.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 relative z-10" />
                      <div className="flex-1 relative z-10">
                      <div className="flex items-start justify-between">
                          <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">{worker.name}</h3>
                          <p className="text-sm font-medium text-primary dark:text-primary-dark">{worker.category} • {worker.experience_level}</p>
                          </div>
                          {Boolean(worker.is_verified) && (
                          <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Verified
                          </span>
                          )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          {Number(worker.rating).toFixed(1)} <span className="text-slate-400 dark:text-slate-500 font-normal">({worker.reviewsCount})</span>
                          </span>
                          <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          {worker.distance} km
                          </span>
                      </div>
                      </div>
                  </div>
                  <div className="border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 py-3 flex items-center justify-between mt-auto transition-colors">
                      <span className="font-bold text-slate-900 dark:text-white text-lg">${worker.hourly_rate}<span className="text-slate-500 dark:text-slate-400 font-normal text-sm">/hr</span></span>
                      <span className="bg-slate-900 dark:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium group-hover:bg-primary dark:group-hover:bg-primary-dark transition-colors">{t('View Profile')}</span>
                  </div>
                  </Link>
                </motion.div>
            ))}
            </div>
        )}
      </motion.section>

    </motion.div>
  );
}
