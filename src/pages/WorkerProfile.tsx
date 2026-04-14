import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Star, MapPin, Calendar, MessageSquare, ShieldCheck, ArrowLeft, Heart, Share2, Award, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import type { WorkerProfile } from '../types';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleOnHover } from '../utils/animations';

export function WorkerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    api.get(`/workers/${id}`).then(res => setWorker(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!bookingDate) return alert('Select a date');
    setBookingLoading(true);
    try {
      if (!user) return alert('You must be logged in to book.');
      await api.post('/bookings', { 
        client_id: user.id, 
        worker_id: id, 
        job_date: bookingDate,
        total_price: worker?.hourly_rate || 0,
        payment_method: 'wallet' 
      });
      alert('Booking requested successfully!');
      navigate('/bookings');
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (isLoading) return (
    <div className="max-w-6xl mx-auto p-4 animate-pulse">
       <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8"></div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
       </div>
    </div>
  );
  if (!worker) return <div className="p-12 text-center font-bold text-slate-500">Worker not found</div>;

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="max-w-6xl mx-auto p-4 md:p-0 transition-colors duration-300"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" /> {t('Back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           {/* Profile Header */}
           <motion.div variants={fadeInUp()} className="bg-white dark:bg-surface-dark p-6 md:p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                 <img src={worker.avatar_url || 'https://i.pravatar.cc/150'} alt={worker.name} className="w-40 h-40 rounded-[2.5rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl" />
                 <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                       <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{worker.name}</h1>
                       {worker.is_verified && (
                         <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-full uppercase">
                           <ShieldCheck className="w-3 h-3" /> Verified
                         </span>
                       )}
                    </div>
                    <p className="text-xl font-bold text-primary dark:text-primary-dark mb-4">{worker.category} • {worker.experience_level}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-600 dark:text-slate-400 font-bold">
                       <span className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /> {Number(worker.rating).toFixed(1)} ({worker.reviewsCount} {t('Reviews')})</span>
                       <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-slate-400" /> {worker.distance} km away</span>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* About & Skills */}
           <motion.div variants={fadeInUp(0.1)} className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">About Professional</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-8">
                 {worker.bio || "Professional worker with extensive experience in providing high-quality services to the local community. Dedicated to excellence and customer satisfaction."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                       {worker.skills?.map(skill => (
                          <span key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-bold text-sm transition-colors">{skill}</span>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600"><Award className="w-5 h-5" /></div>
                       <p className="font-bold text-slate-700 dark:text-slate-300">Top Rated Elite Worker</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600"><Zap className="w-5 h-5" /></div>
                       <p className="font-bold text-slate-700 dark:text-slate-300">Fast Response (under 10m)</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Sidebar: Booking Card */}
        <aside className="space-y-6 lg:sticky lg:top-24">
           <motion.div variants={fadeInUp(0.2)} className="bg-slate-900 dark:bg-surface-dark rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative z-10">
                 <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-white/60 font-black uppercase tracking-widest text-[10px] mb-1">Hourly Rate</p>
                        <p className="text-4xl font-black">${worker.hourly_rate}<span className="text-lg opacity-60">/hr</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/60 font-black uppercase tracking-widest text-[10px] mb-1">Availability</p>
                        <p className="text-green-400 font-black">Mon - Sat</p>
                    </div>
                 </div>

                 <div className="space-y-4 mb-8">
                    <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 block">Scheduled For</label>
                       <input 
                         type="datetime-local" 
                         value={bookingDate}
                         onChange={e => setBookingDate(e.target.value)}
                         className="w-full bg-transparent font-bold text-white outline-none caret-primary" 
                       />
                    </div>
                 </div>

                 <motion.button 
                   {...scaleOnHover}
                   onClick={handleBook}
                   disabled={bookingLoading}
                   className="w-full bg-primary py-4 rounded-2xl font-black text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mb-4"
                 >
                    {bookingLoading ? 'Processing...' : (
                      <><Calendar className="w-5 h-5" /> Book Service Now</>
                    )}
                 </motion.button>
                 
                 <motion.button 
                   {...scaleOnHover}
                   onClick={() => navigate('/messages')}
                   className="w-full bg-white/10 border border-white/20 py-4 rounded-2xl font-black text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                 >
                    <MessageSquare className="w-5 h-5" /> Send Message
                 </motion.button>
              </div>
           </motion.div>

           <motion.div variants={fadeInUp(0.3)} className="bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex justify-around">
              <button className="flex flex-col items-center gap-2 text-slate-400 hover:text-red-500 transition-colors">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full"><Heart className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Save</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full"><Share2 className="w-5 h-5" /></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
              </button>
           </motion.div>
        </aside>
      </div>
    </motion.div>
  );
}
