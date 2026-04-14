import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function LandingPage() {
  const { t, i18n } = useTranslation();


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden transition-colors duration-500">
       {/* Background Glows */}
       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[100px] pointer-events-none"></div>

       {/* Custom Navbar for Landing Page */}
       <header className="relative z-50 flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white transition-colors">
             <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
             <span className="text-2xl font-black tracking-tight">SkillBridge</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
             <div className="flex items-center gap-1 bg-[#1a202c] text-white rounded-full p-1 text-xs font-bold shadow-md">
                <div className="pl-3 pr-2 flex items-center"><Globe className="w-4 h-4 text-blue-400" /></div>
                <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded-full hover:bg-slate-700 transition ${i18n.language === 'en' ? 'text-amber-400' : ''}`}>EN</button>
                <button onClick={() => changeLanguage('hi')} className={`px-2 py-1 rounded-full hover:bg-slate-700 transition ${i18n.language === 'hi' ? 'text-amber-400 bg-amber-400/20' : ''}`}>हि</button>
                <button onClick={() => changeLanguage('es')} className={`px-2 py-1 rounded-full hover:bg-slate-700 transition ${i18n.language === 'es' ? 'text-amber-400' : ''}`}>ES</button>
                <button onClick={() => changeLanguage('fr')} className={`px-2 py-1 rounded-full hover:bg-slate-700 transition ${i18n.language === 'fr' ? 'text-amber-400' : ''}`}>FR</button>
             </div>
             
             <nav className="flex items-center gap-6 text-sm font-semibold text-slate-600">
                <Link to="/how-it-works" className="hover:text-slate-900 transition">{t('How it Works') || 'How it Works'}</Link>
                <Link to="/search" className="hover:text-slate-900 transition">{t('Explore') || 'Explore'}</Link>
                <Link to="/search?category=barter" className="hover:text-slate-900 transition">{t('Barter') || 'Barter'}</Link>
                <Link to="/community" className="hover:text-slate-900 transition">{t('Community') || 'Community'}</Link>
             </nav>
          </div>

          <div className="flex items-center gap-3">
             <Link to="/login" className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition drop-shadow-sm bg-white dark:bg-surface-dark">Log In</Link>
             <Link to="/signup" className="px-6 py-2.5 rounded-full bg-[#1e293b] dark:bg-primary-dark text-white text-sm font-bold hover:bg-slate-800 dark:hover:opacity-90 transition shadow-md">Get Started</Link>
          </div>
       </header>

       {/* Hero Section */}
       <main className="relative z-10 max-w-[1400px] mx-auto px-8 pt-10 pb-20 lg:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Hero Content */}
          <div className="flex flex-col items-start gap-8">
             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="inline-flex items-center gap-2 bg-[#fef3c7] text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold border border-amber-200">
                <div className="flex gap-1 text-[10px]">
                   <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm border border-amber-100">✦</span>
                   <span className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm border border-amber-100 -ml-2">🌍</span>
                </div>
                {i18n.language === 'en' ? 'Cross-Cultural Skill Exchange' : 'संस्कृतियों में कौशल का आदान-प्रदान'}
             </motion.div>

             <motion.h1 initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="text-6xl md:text-7xl font-black text-[#1e293b] leading-[1.1] tracking-tight">
                {i18n.language === 'en' ? (
                   <>Share Your <span className="relative">Skills<svg className="absolute w-full h-4 -bottom-1 left-0 text-amber-400" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 0" stroke="currentColor" strokeWidth="4" fill="none"/></svg></span>, <br/>Grow Together</>
                ) : (
                   <>अपना <span className="text-[#d97706] relative">कौशल</span> साझा <br/>करें, साथ बढ़ें
                     <svg className="absolute w-32 h-4 -bottom-1 left-32 text-[#d97706]/40" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 0" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                   </>
                )}
             </motion.h1>

             <motion.p initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                {i18n.language === 'en' 
                  ? 'A platform where professionals exchange knowledge—for money or via barter. Build connections, earn income.'
                  : 'वह प्लेटफ़ॉर्म जहाँ पेशेवर ज्ञान का आदान-प्रदान करते हैं - पैसे के लिए या बार्टर के माध्यम से। कनेक्शन बनाएं, आय अर्जित करें।'}
             </motion.p>

             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/search" className="bg-[#f59e0b] hover:bg-amber-500 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2">
                   {i18n.language === 'en' ? 'Find Skills' : 'कौशल खोजें'}
                </Link>
                <Link to="/signup?role=worker" className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-slate-200/50 transition-all flex items-center gap-2">
                   {i18n.language === 'en' ? 'Provide Skills' : 'कौशल प्रदान करें'}
                </Link>
             </motion.div>

             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.5}} className="flex items-center gap-10 pt-10">
                <div>
                   <h3 className="text-3xl font-black text-slate-900">48K+</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{i18n.language === 'en' ? 'Active Members' : 'सक्रिय सदस्य'}</p>
                </div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">12K+</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{i18n.language === 'en' ? 'Skills Listed' : 'कौशल सूचीबद्ध'}</p>
                </div>
                <div>
                   <h3 className="text-3xl font-black text-slate-900">80+</h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{i18n.language === 'en' ? 'Countries' : 'देश'}</p>
                </div>
             </motion.div>
          </div>

          {/* Right Floating Cards */}
          <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
             
             {/* Card 1: Priya */}
             <motion.div 
               initial={{opacity: 0, scale: 0.9, x: 50, y: -20}} 
               animate={{opacity: 1, scale: 1, x: 0, y: 0}} 
               transition={{delay: 0.4, type: 'spring'}}
               className="absolute top-4 right-10 z-20 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white w-80 transform rotate-1"
             >
                <div className="flex items-center gap-4 mb-5">
                   <div className="w-14 h-14 rounded-full bg-orange-100 border-2 border-white shadow-sm flex flex-col items-center justify-center text-xl overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Priya" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 text-sm">Priya Sharma</h4>
                      <p className="text-xs text-slate-500 font-medium">UI/UX Designer</p>
                   </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-6">
                   <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Figma</span>
                   <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Branding</span>
                   <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Prototyping</span>
                </div>
                <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                    <p className="text-2xl font-black text-slate-800">₹2,500 <span className="text-xs text-slate-400 font-medium line-through decoration-slate-300">/hr</span></p>
                    <span className="flex items-center gap-1 text-[10px] bg-[#f59e0b] text-white px-2 py-1 rounded-md font-bold shadow-sm shadow-amber-500/20"><Globe className="w-3 h-3" /> Barter OK</span>
                </div>
             </motion.div>

             {/* Card 2: Carlos */}
             <motion.div 
               initial={{opacity: 0, scale: 0.9, x: 50, y: 20}} 
               animate={{opacity: 1, scale: 1, x: -60, y: 160}} 
               transition={{delay: 0.5, type: 'spring'}}
               className="absolute z-10 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white w-80 transform -rotate-2"
             >
                <div className="flex items-center gap-4 mb-5">
                   <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                       <img src="https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&w=150&q=80" alt="Carlos" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 text-sm">Carlos Mendez</h4>
                      <p className="text-xs text-slate-500 font-medium">Full Stack Dev</p>
                   </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-6">
                   <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">React</span>
                   <span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">Node.js</span>
                </div>
                <div className="border-t border-slate-100 pt-4">
                    <p className="text-2xl font-black text-slate-800">$45 <span className="text-xs text-slate-400 font-medium">/hr</span></p>
                </div>
             </motion.div>

             {/* Card 3: Aiko */}
             <motion.div 
               initial={{opacity: 0, scale: 0.9, y: 50}} 
               animate={{opacity: 1, scale: 1, y: 300, x: 20}} 
               transition={{delay: 0.6, type: 'spring'}}
               className="absolute z-30 bg-[#148e7e] text-white p-6 rounded-[2rem] shadow-2xl shadow-teal-900/40 w-72 transform rotate-1"
             >
                <div className="flex items-center gap-4 mb-5">
                   <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden shadow-sm">
                       <span className="text-2xl">🎵</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-sm">Aiko Tanaka</h4>
                      <p className="text-xs text-teal-100 font-medium">Music Teacher</p>
                   </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-8">
                   <span className="text-[10px] font-bold text-white bg-white/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">Piano</span>
                   <span className="text-[10px] font-bold text-white bg-white/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">Composition</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20">
                       <Globe className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-black text-white leading-tight">Swap for Yoga<br/>lessons</p>
                </div>
             </motion.div>

          </div>
       </main>
    </div>
  );
}
