import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, Wallet } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function BottomNav() {
  const user = useAuthStore(state => state.user);
  const { t } = useTranslation();

  const navItems = [
    { path: user?.role === 'worker' ? '/worker-dashboard' : '/dashboard', icon: Home, label: t(user?.role === 'worker' ? 'Dashboard' : 'Home') },
    { path: '/search', icon: Search, label: t('Search'), hideForWorker: true },
    { path: '/bookings', icon: Calendar, label: t('Bookings'), protected: true },
    { path: '/messages', icon: MessageSquare, label: t('Messages'), protected: true },
    { path: '/wallet', icon: Wallet, label: t('Wallet'), protected: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 flex justify-around items-center px-2 py-3 z-50 transition-colors duration-300">
      {navItems.map((item) => {
        if (item.protected && !user) return null;
        if (item.hideForWorker && user?.role === 'worker') return null;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-1 transition-all relative",
                isActive ? "text-primary dark:text-primary-dark" : "text-slate-400 dark:text-slate-500"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="bottomTab"
                    className="absolute -top-3 w-8 h-1 bg-primary dark:bg-primary-dark rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
