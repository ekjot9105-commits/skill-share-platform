import { motion } from 'framer-motion';

import { User, Briefcase, RefreshCcw } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function HowItWorks() {


  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 mb-20 animate-fade-in relative z-10">
      <div className="mb-8"><BackButton /></div>
      <div className="text-center max-w-3xl mx-auto mb-16">
         <h1 className="text-4xl md:text-5xl md:leading-tight font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight transition-colors">How SkillBridge Works</h1>
         <p className="text-xl text-slate-500 dark:text-slate-400 font-medium transition-colors">The simplest way to exchange skills, services, and grow your local community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] text-center transition-colors">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <User className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">1. Create Profile</h3>
            <p className="text-slate-500 dark:text-slate-400">Sign up as a client to hire, or as a worker to list your own amazing skills.</p>
         </motion.div>

         <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-surface-dark p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] text-center transition-colors">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <Briefcase className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">2. Find Matches</h3>
            <p className="text-slate-500 dark:text-slate-400">Use our AI search or explore the vibrant grid to find verified professionals near you.</p>
         </motion.div>

         <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCcw className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black mb-3">3. Hire or Barter</h3>
            <p className="text-slate-500">Pay directly through the digital wallet, or swap your own services for free using Barter.</p>
         </motion.div>
      </div>
    </div>
  );
}
