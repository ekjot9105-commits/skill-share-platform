import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, User as UserIcon, LogIn } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export function BottomNav() {
  const user = useAuthStore(state => state.user);
  const { t } = useTranslation();

  const navItems = [
    { path: user?.role === 'worker' ? '/worker-dashboard' : '/dashboard', icon: Home, label: t(user?.role === 'worker' ? 'Dashboard' : 'Home') },
    { path: '/search', icon: Search, label: t('Search'), hideForWorker: true },
    { path: '/bookings', icon: Calendar, label: t('Bookings'), protected: true },
    { path: '/messages', icon: MessageSquare, label: t('Messages'), protected: true },
    { path: user ? '/profile' : '/login', icon: user ? UserIcon : LogIn, label: user ? t('Profile') : t('Login') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          if (item.protected && !user) return null;
          if (item.hideForWorker && user?.role === 'worker') return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                  isActive ? "text-primary" : "text-slate-500 hover:text-slate-900"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
