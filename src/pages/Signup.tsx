import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, User, Briefcase, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { motion } from 'framer-motion';
import { scaleOnHover } from '../utils/animations';
import { BackButton } from '../components/BackButton';

export function Signup() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || 'client');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/register', { ...formData, role });
      login(res.data);
      if (res.data.token) {
        localStorage.setItem('skillshare_token', res.data.token);
      }
      navigate(role === 'worker' ? '/worker-dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative"
      >
        <div className="absolute top-0 left-0"><BackButton /></div>
        <Link to="/" className="text-3xl font-black text-primary dark:text-primary-dark flex items-center justify-center gap-2 mb-12">
          <span className="bg-primary dark:bg-primary-dark text-white p-1.5 rounded-xl">Sk</span>
          SkillShare
        </Link>
        
        <div className="bg-white dark:bg-surface-dark p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('Sign Up')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Join our elite local community of skilled professionals</p>
          </div>

          <div className="flex p-2 bg-slate-100 dark:bg-slate-900 rounded-[2rem] mb-10 transition-colors">
             <button 
                onClick={() => setRole('client')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${role === 'client' ? 'bg-white dark:bg-surface-dark text-primary dark:text-primary-dark shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <User className="w-4 h-4" /> {t('I want to hire')}
                {role === 'client' && <Check className="w-4 h-4 text-primary" />}
             </button>
             <button 
                onClick={() => setRole('worker')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${role === 'worker' ? 'bg-white dark:bg-surface-dark text-primary dark:text-primary-dark shadow-xl' : 'text-slate-500 hover:text-slate-700'}`}
             >
                <Briefcase className="w-4 h-4" /> {t('I want to work')}
                {role === 'worker' && <Check className="w-4 h-4 text-primary" />}
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('Name')}</label>
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary" />
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 rounded-2xl p-4 pl-12 font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                      placeholder="Your Full Name"
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('Email')}</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary" />
                    <input 
                      type="email" required
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 rounded-2xl p-4 pl-12 font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                      placeholder="name@example.com"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('Password')}</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary" />
                    <input 
                      type="password" required
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 rounded-2xl p-4 pl-12 font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                      placeholder="••••••••"
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
              </div>
            </div>

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-black uppercase text-center bg-red-50 py-2 rounded-lg">{error}</motion.p>}

            <motion.button 
              {...scaleOnHover}
              disabled={loading}
              className="w-full bg-primary dark:bg-primary-dark py-5 rounded-[1.5rem] text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 h-16"
            >
              {loading ? 'Creating Account...' : <>{t('Sign Up')} <ArrowRight className="w-5 h-5"/></>}
            </motion.button>
          </form>

          <div className="mt-12 text-center text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest border-t dark:border-slate-800 pt-8">
            Already have an account? <Link to="/login" className="text-primary dark:text-primary-dark ml-2 hover:underline">{t('Login')}</Link>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" /> Trusted Professional Network
        </div>
      </motion.div>
    </div>
  );
}
