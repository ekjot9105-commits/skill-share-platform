import { NavLink, Link } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, Wallet, Moon, Sun, Languages } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'mr', name: 'मराठी' },
  { code: 'bn', name: 'বাংলা' },
];

export function Navbar() {
  const isDark = useThemeStore(state => state.isDark);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const user = useAuthStore(state => state.user);
  const { t, i18n } = useTranslation();

  const navItems = [
    { path: user?.role === 'worker' ? '/worker-dashboard' : '/dashboard', icon: Home, label: t(user?.role === 'worker' ? 'Dashboard' : 'Home') },
    { path: '/search', icon: Search, label: t('Find Workers'), hideForWorker: true },
    { path: '/bookings', icon: Calendar, label: t('Bookings'), protected: true },
    { path: '/messages', icon: MessageSquare, label: t('Messages'), protected: true },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="hidden md:flex sticky top-0 bg-[#fffcf5]/90 backdrop-blur-md border-b border-white dark:border-slate-800 z-50 h-16 items-center px-6 justify-between transition-colors duration-300 shadow-sm">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-xl font-black text-slate-900 dark:text-primary-dark flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          SkillBridge
        </NavLink>
        <nav className="flex gap-1 text-sm font-medium">
          {navItems.map((item) => {
            if (item.protected && !user) return null;
            if (item.hideForWorker && user?.role === 'worker') return null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "px-4 py-2 rounded-full flex items-center gap-2 transition-colors",
                    isActive 
                      ? "bg-slate-100 dark:bg-slate-800 text-primary dark:text-primary-dark font-semibold" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
            <Languages className="w-5 h-5" />
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={clsx(
                  "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                  i18n.language === lang.code ? "text-primary font-bold" : "text-slate-600 dark:text-slate-400"
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? 'dark' : 'light'}
              initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {user ? (
          <>
            <NavLink to="/wallet" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Wallet className="w-4 h-4 text-green-600 dark:text-green-500" />
              ${(user.wallet_balance || 0).toFixed(2)}
            </NavLink>
            <NavLink to="/profile" className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors relative">
              <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center font-bold uppercase transition-transform hover:scale-110">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium pr-2 text-slate-700 dark:text-slate-300">{user.name}</span>
            </NavLink>
          </>
        ) : (
          <div className="flex gap-3">
             <Link to="/login" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 transition-colors">{t('Login')}</Link>
             <Link to="/signup" className="bg-primary dark:bg-primary-dark text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90 shadow-md hover:shadow-lg transition-all">{t('Sign Up')}</Link>
          </div>
        )}
      </div>
    </header>
  );
}
