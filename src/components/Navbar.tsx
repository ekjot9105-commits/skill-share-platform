import { NavLink, Link } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const user = useAuthStore(state => state.user);
  const { t } = useTranslation();

  const navItems = [
    { path: user?.role === 'worker' ? '/worker-dashboard' : '/dashboard', icon: Home, label: t(user?.role === 'worker' ? 'Dashboard' : 'Home') },
    { path: '/search', icon: Search, label: t('Find Workers'), hideForWorker: true },
    { path: '/bookings', icon: Calendar, label: t('Bookings'), protected: true },
    { path: '/messages', icon: MessageSquare, label: t('Messages'), protected: true },
  ];

  return (
    <header className="hidden md:flex sticky top-0 bg-white border-b border-slate-200 z-50 h-16 items-center px-6 justify-between">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <span className="bg-primary text-white p-1 rounded">Sk</span>
          SkillShare
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
                    isActive ? "bg-slate-100 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50"
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
        {user ? (
          <>
            <NavLink to="/wallet" className="flex items-center gap-2 bg-slate-50 border px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100">
              <Wallet className="w-4 h-4 text-green-600" />
              ${(user.wallet_balance || 0).toFixed(2)}
            </NavLink>
            <NavLink to="/profile" className="flex items-center gap-2 hover:bg-slate-50 p-2 rounded-full transition-colors relative">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium pr-2 text-slate-700">{user.name}</span>
            </NavLink>
          </>
        ) : (
          <div className="flex gap-3">
             <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-slate-900 px-4 py-2">{t('Login')}</Link>
             <Link to="/signup" className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary/90">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
