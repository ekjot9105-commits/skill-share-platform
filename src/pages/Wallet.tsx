import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowUpRight, ArrowDownLeft, Plus, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { BackButton } from '../components/BackButton';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleOnHover } from '../utils/animations';

export function Wallet() {
  const user = useAuthStore(state => state.user);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api.get('/wallet/transactions').then(res => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-4 md:p-0 transition-colors duration-300 relative"
    >
      <div className="mb-4"><BackButton /></div>
      <motion.h1 variants={fadeInUp()} className="text-3xl font-black mb-8 text-slate-900 dark:text-white">{t('Wallet')}</motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <motion.div 
          variants={fadeInUp(0.1)}
          className="lg:col-span-1 bg-gradient-to-br from-primary to-blue-700 dark:from-primary-dark dark:to-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[240px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div>
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
            <h2 className="text-5xl font-black">${(user?.wallet_balance || 0).toFixed(2)}</h2>
          </div>
          <div className="flex gap-3">
             <motion.button {...scaleOnHover} className="flex-1 bg-white/20 backdrop-blur-md py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors">
                <Plus className="w-5 h-5" /> Add Funds
             </motion.button>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div 
          variants={fadeInUp(0.2)}
          className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transition-all"
        >
          <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white"><History className="w-5 h-5 text-primary"/> Recent Transactions</h3>
            <button className="text-primary dark:text-primary-dark font-bold text-sm">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
             {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                   <div key={i} className="p-4 flex gap-4 border-b dark:border-slate-800 animate-pulse">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
                      <div className="flex-1 space-y-2 py-1">
                         <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
                         <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/4"></div>
                      </div>
                   </div>
                ))
             ) : transactions.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">No transactions found.</div>
             ) : (
                transactions.map((tx) => (
                   <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b dark:border-slate-800 last:border-0 text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl ${tx.type === 'credit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="font-bold">{tx.description}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{new Date(tx.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <p className={`font-black text-lg ${tx.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                         {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </p>
                   </div>
                ))
             )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
