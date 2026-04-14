import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../components/BackButton';
import { User, Bell, Heart, Settings, Camera, LogOut, ChevronRight } from 'lucide-react';

export function Profile() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'notifications'>('profile');

  // Mocks for UI Polish
  const [mockNotifs, setMockNotifs] = useState({ email: true, push: true, promo: false });
  const [mockName, setMockName] = useState(user?.name || '');

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
      i18n.changeLanguage(e.target.value);
  };

  if (!user) return <div className="p-8 text-center text-primary font-bold">Please login</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto mb-20 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2 relative">
          <div className="absolute top-0 right-0 md:hidden"><BackButton /></div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">{t('Profile')} Settings</h1>
          
          <button onClick={() => setActiveTab('profile')} className={`flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === 'profile' ? 'bg-primary text-white shadow-[0_4px_20px_-5px_rgba(245,158,11,0.4)]' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)]'}`}>
              <span className="flex items-center gap-3"><User className="w-5 h-5"/> Account Info</span>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`}/>
          </button>
          
          <button onClick={() => setActiveTab('saved')} className={`flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === 'saved' ? 'bg-primary text-white shadow-[0_4px_20px_-5px_rgba(245,158,11,0.4)]' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)]'}`}>
              <span className="flex items-center gap-3"><Heart className="w-5 h-5"/> Saved Workers</span>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'saved' ? 'text-white' : 'text-slate-400'}`}/>
          </button>

          <button onClick={() => setActiveTab('notifications')} className={`flex items-center justify-between p-4 rounded-2xl transition-all font-bold ${activeTab === 'notifications' ? 'bg-primary text-white shadow-[0_4px_20px_-5px_rgba(245,158,11,0.4)]' : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.02)]'}`}>
              <span className="flex items-center gap-3"><Bell className="w-5 h-5"/> Notifications</span>
              <ChevronRight className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-white' : 'text-slate-400'}`}/>
          </button>

          <button onClick={handleLogout} className="flex items-center justify-between p-4 rounded-2xl transition font-bold text-red-600 bg-red-50 hover:bg-red-100 mt-4 border border-red-100">
              <span className="flex items-center gap-3"><LogOut className="w-5 h-5"/> Log Out</span>
          </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
          {activeTab === 'profile' && (
              <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-6 lg:p-8 animate-fade-in transition-all">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Settings className="w-6 h-6 text-primary"/> General Settings</h2>
                  
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b">
                     <div className="relative group cursor-pointer">
                         <div className="w-24 h-24 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-3xl font-black uppercase overflow-hidden border-4 border-white shadow-lg group-hover:opacity-80 transition">
                            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                         </div>
                         <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md"><Camera className="w-4 h-4"/></div>
                     </div>
                     <div>
                         <p className="font-bold text-lg text-slate-900 dark:text-white">{user.email}</p>
                         <p className="text-slate-500 font-medium uppercase text-xs tracking-wider bg-slate-100 inline-block px-2 py-1 rounded mt-1">{user.role}</p>
                     </div>
                  </div>

                  <div className="space-y-4 max-w-md">
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Display Name</label>
                          <input type="text" value={mockName} onChange={e => setMockName(e.target.value)} className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary outline-none" />
                      </div>
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Language Settings</label>
                          <select 
                            className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary outline-none"
                            value={i18n.language}
                            onChange={changeLanguage}
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                          </select>
                      </div>
                      <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl mt-4 hover:bg-slate-800 transition">Save Changes</button>
                  </div>
              </div>
          )}

          {activeTab === 'saved' && (
              <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-6 lg:p-8 animate-fade-in transition-all">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Heart className="w-6 h-6 text-pink-500"/> Saved Workers</h2>
                  <div className="bg-pink-50 rounded-2xl p-6 text-center border-2 border-dashed border-pink-200">
                      <Heart className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                      <h3 className="font-bold text-pink-900 mb-1">No saved workers yet</h3>
                      <p className="text-sm text-pink-700 font-medium mb-4">Tap the heart icon on any worker profile to save them for later.</p>
                      <Link to="/search" className="bg-white text-pink-700 font-bold px-6 py-2 rounded-lg border border-pink-200 shadow-sm hover:shadow transition">Browse Workers</Link>
                  </div>
              </div>
          )}

          {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-6 lg:p-8 animate-fade-in transition-all">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white"><Bell className="w-6 h-6 text-amber-500"/> Notification Preferences</h2>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4">
                          <div>
                              <p className="font-bold text-slate-900">Email Notifications</p>
                              <p className="text-sm text-slate-500">Receive updates about your bookings and messages.</p>
                          </div>
                          <button onClick={() => setMockNotifs(p => ({...p, email: !p.email}))} className={`w-12 h-6 rounded-full transition-colors relative ${mockNotifs.email ? 'bg-primary' : 'bg-slate-200'}`}>
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${mockNotifs.email ? 'left-6' : 'left-0.5'}`}></div>
                          </button>
                      </div>
                      <div className="flex items-center justify-between border-b pb-4">
                          <div>
                              <p className="font-bold text-slate-900">Push Notifications</p>
                              <p className="text-sm text-slate-500">Get instant alerts on your device for incoming chat messages.</p>
                          </div>
                          <button onClick={() => setMockNotifs(p => ({...p, push: !p.push}))} className={`w-12 h-6 rounded-full transition-colors relative ${mockNotifs.push ? 'bg-primary' : 'bg-slate-200'}`}>
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${mockNotifs.push ? 'left-6' : 'left-0.5'}`}></div>
                          </button>
                      </div>
                      <div className="flex items-center justify-between">
                          <div>
                              <p className="font-bold text-slate-900">Promotions & Marketing</p>
                              <p className="text-sm text-slate-500">Weekly newsletters with platform updates.</p>
                          </div>
                          <button onClick={() => setMockNotifs(p => ({...p, promo: !p.promo}))} className={`w-12 h-6 rounded-full transition-colors relative ${mockNotifs.promo ? 'bg-primary' : 'bg-slate-200'}`}>
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${mockNotifs.promo ? 'left-6' : 'left-0.5'}`}></div>
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
}
