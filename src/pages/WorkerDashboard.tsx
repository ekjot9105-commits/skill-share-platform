import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { BackButton } from '../components/BackButton';
import { CheckCircle, XCircle, Settings, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DollarSign, Briefcase, Star as StarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function WorkerDashboard() {
  const user = useAuthStore(state => state.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
      hourly_rate: 0,
      bio: '',
      video_url: ''
  });
  const [updateStatus, setUpdateStatus] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
     if (user) {
         fetchBookings();
         if (user.workerProfile) {
             setProfileData({
                 hourly_rate: user.workerProfile.hourly_rate || 0,
                 bio: user.workerProfile.bio || '',
                 video_url: user.workerProfile.video_url || ''
             });
         }
     }
  }, [user]);

  const fetchBookings = async () => {
      if (!user) return;
      try {
          const res = await api.get(`/bookings/worker/${user.id}`);
          setBookings(res.data);
      } catch (err) {
          console.error(err);
      }
  };

  const handleUpdateStatus = async (bookingId: number, status: string) => {
      try {
          await api.put(`/bookings/${bookingId}/status`, { status });
          fetchBookings(); // Refresh
      } catch (err) {
          console.error(err);
      }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setUpdateStatus('Updating...');
      try {
          await api.put(`/workers/${user.id}`, profileData);
          setUpdateStatus('Profile updated successfully!');
          setTimeout(() => setUpdateStatus(''), 3000);
      } catch (err) {
          setUpdateStatus('Failed to update.');
      }
  };

  if (!user || user.role !== 'worker') {
      return <div className="p-8 text-center"><h2 className="text-2xl font-bold">Unauthorized. Worker access only.</h2></div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div><BackButton /></div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2 mt-2">{t('Worker Dashboard')}</h1>
      
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between hover:-translate-y-1 transition-transform">
              <div>
                  <p className="text-blue-100 font-bold text-sm mb-1 uppercase tracking-wider">{t('Total Earnings')}</p>
                  <p className="text-4xl font-black">${bookings.filter(b => b.status === 'completed' && b.payment_method !== 'skill_exchange').reduce((acc, curr) => acc + curr.total_price, 0)}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl"><DollarSign className="w-8 h-8" /></div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between hover:-translate-y-1 transition-transform">
              <div>
                  <p className="text-emerald-100 font-bold text-sm mb-1 uppercase tracking-wider">{t('Jobs Completed')}</p>
                  <p className="text-4xl font-black">{bookings.filter(b => b.status === 'completed').length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl"><Briefcase className="w-8 h-8" /></div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between hover:-translate-y-1 transition-transform">
              <div>
                  <p className="text-amber-100 font-bold text-sm mb-1 uppercase tracking-wider">{t('Avg Rating')}</p>
                  <p className="text-4xl font-black flex items-center gap-2">{Number(user.workerProfile?.rating || 0).toFixed(1)} <StarIcon className="w-6 h-6 fill-white" /></p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl"><StarIcon className="w-8 h-8" /></div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Settings */}
        <div className="md:col-span-1 bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> {t('Profile Settings')}</h2>
            {updateStatus && <div className="p-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">{updateStatus}</div>}
            
            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Hourly Rate ($)</label>
                    <input 
                        type="number" 
                        value={profileData.hourly_rate} 
                        onChange={e => setProfileData({...profileData, hourly_rate: Number(e.target.value)})}
                        className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary focus:outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Demo Video URL</label>
                    <input 
                        type="url" 
                        placeholder="https://example.com/video.mp4"
                        value={profileData.video_url} 
                        onChange={e => setProfileData({...profileData, video_url: e.target.value})}
                        className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary focus:outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Bio</label>
                    <textarea 
                        rows={4}
                        value={profileData.bio} 
                        onChange={e => setProfileData({...profileData, bio: e.target.value})}
                        className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary focus:outline-none" 
                    />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition shadow-md">
                    Save Changes
                </button>
            </form>
        </div>

        {/* Incoming Requests */}
        <div className="md:col-span-2 bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col gap-4 h-fit">
            <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> {t('Job Requests')}</h2>
            
            {bookings.length === 0 ? (
                <p className="text-slate-500 italic">No incoming requests right now.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookings.map(b => (
                        <div key={b.id} className="border rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{b.client_name}</h3>
                                <p className="text-sm font-medium text-slate-600">Date: {new Date(b.job_date).toLocaleString()}</p>
                                <div className="mt-2 flex gap-2">
                                     {b.payment_method === 'skill_exchange' ? (
                                         <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">Skill Exchange (Barter)</span>
                                     ) : (
                                         <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Paid Wallet: ${b.total_price}</span>
                                     )}
                                     <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded uppercase">{b.status}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                {b.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdateStatus(b.id, 'accepted')} className="flex-1 bg-green-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-green-600 flex items-center justify-center gap-1">
                                            <CheckCircle className="w-4 h-4"/> Accept
                                        </button>
                                        <button onClick={() => handleUpdateStatus(b.id, 'rejected')} className="flex-1 bg-red-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-600 flex items-center justify-center gap-1">
                                            <XCircle className="w-4 h-4"/> Reject
                                        </button>
                                    </div>
                                )}
                                {b.status === 'accepted' && (
                                     <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="w-full bg-blue-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1 shadow-md border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all">
                                         Mark as Done
                                     </button>
                                )}
                                <Link to={`/messages?user_id=${b.client_id}`} className="w-full text-center bg-white border-2 border-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl hover:bg-slate-50">
                                    Message Client
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
