import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { motion } from 'framer-motion';
import { scaleOnHover } from '../utils/animations';
import { BackButton } from '../components/BackButton';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const res = await api.post('/login', { email, password });
      login(res.data);
      // Store token in localStorage if present
      if (res.data.token) {
        localStorage.setItem('skillshare_token', res.data.token);
      }
      navigate(res.data.role === 'worker' ? '/worker-dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute top-0 left-0"><BackButton /></div>
        <Link to="/" className="text-3xl font-black text-primary dark:text-primary-dark flex items-center justify-center gap-2 mb-12">
          <span className="bg-primary dark:bg-primary-dark text-white p-1.5 rounded-xl">Sk</span>
          SkillShare
        </Link>
        
        <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('Login')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Welcome back! Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('Email')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 dark:focus:border-primary-dark/20 rounded-2xl p-4 pl-12 font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('Password')}</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="password" 
                        required 
                        className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 dark:focus:border-primary-dark/20 rounded-2xl p-4 pl-12 font-bold text-slate-700 dark:text-slate-200 outline-none transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-black uppercase text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</motion.p>
            )}

            <motion.button 
              {...scaleOnHover}
              disabled={loading}
              className="w-full bg-primary dark:bg-primary-dark py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 h-14"
            >
              {loading ? 'Authenticating...' : <>{t('Login')} <ArrowRight className="w-5 h-5"/></>}
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t dark:border-slate-800 text-center">
             <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
                Don't have an account? 
                <Link to="/signup" className="text-primary dark:text-primary-dark ml-2 hover:underline">{t('Sign Up')}</Link>
             </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" /> Secure SSL Encrypted Access
        </div>
      </motion.div>
    </div>
  );
}
