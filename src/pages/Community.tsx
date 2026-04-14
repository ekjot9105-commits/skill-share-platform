import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, MessagesSquare, Award } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function Community() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 mb-20 animate-fade-in relative z-10">
      <div className="mb-8"><BackButton /></div>
      <div className="text-center max-w-3xl mx-auto mb-16">
         <h1 className="text-4xl md:text-5xl md:leading-tight font-black text-slate-900 mb-6 uppercase tracking-tight">SkillBridge Community</h1>
         <p className="text-xl text-slate-500 font-medium">Join 48,000+ professionals building relationships and sharing knowledge across 80 countries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
         <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[3rem] shadow-xl text-white">
            <Users className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-black mb-4">Local Meetups</h3>
            <p className="text-blue-100 text-lg">Connect with workers and clients in your area. We host monthly local barter-networking events in major cities.</p>
            <button className="mt-8 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-transform">Find Local Events</button>
         </motion.div>

         <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 rounded-[3rem] shadow-xl text-white">
            <MessagesSquare className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-black mb-4">Forums & Discussions</h3>
            <p className="text-orange-100 text-lg">Ask questions, share tips, and get advice from top-rated Elite Workers in our private community boards.</p>
            <button className="mt-8 bg-white text-orange-700 font-bold px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-transform">Join the Discussion</button>
         </motion.div>
      </div>
      
      <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full -ml-32 -mt-32 blur-3xl opacity-50"></div>
         <Award className="w-16 h-16 text-green-500 mx-auto mb-6 relative z-10" />
         <h2 className="text-3xl font-black text-slate-900 mb-4 relative z-10">Elite Worker Program</h2>
         <p className="text-slate-500 max-w-2xl mx-auto mb-8 relative z-10">Consistently deliver 5-star service and unlock our Elite status, giving you priority search ranking, reduced platform fees, and dedicated support.</p>
      </div>

    </div>
  );
}
