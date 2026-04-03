import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Video } from 'lucide-react';
import api from '../api';
import { useAuthStore } from '../store/useAuthStore';
import { BackButton } from '../components/BackButton';
import type { WorkerProfile, Review } from '../types';

export function WorkerProfilePage() {
  const { id } = useParams();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const user = useAuthStore(state => state.user);
  const updateWallet = useAuthStore(state => state.updateWallet);
  const [isBooking, setIsBooking] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');
  
  const [jobDate, setJobDate] = useState(() => {
     const d = new Date();
     d.setHours(d.getHours() + 1);
     return d.toISOString().slice(0, 16);
  });
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'skill_exchange'>('wallet');

  useEffect(() => {
    // We fetch all workers and find him because our simple sqlite backend returns a list
    api.get('/workers').then(res => {
      const found = res.data.find((w: any) => w.id === Number(id));
      if (found) setWorker(found);
    }).catch(console.error);

    // Fetch reviews (mocked as empty array initially in our DB if we didn't write an endpoint)
    // Actually our DB has no review GET endpoint, so we will just show empty for now, 
    // but we can simulate fetching.
    setReviews([]);
  }, [id]);

  const handleBook = async () => {
     if (!user) {
         setBookError('Please login first to book a worker.');
         return;
     }
     if (!worker) return;

     setIsBooking(true);
     setBookError('');
     
     try {
         const res = await api.post('/bookings', {
             client_id: user.id,
             worker_id: worker.id,
             job_date: jobDate,
             total_price: worker.hourly_rate * 2, // Minimum 2 hours
             payment_method: paymentMethod
         });
         
         if (res.data.new_balance !== null) {
             updateWallet(res.data.new_balance);
         }
         setBookSuccess('Successfully booked! Wait for confirmation.');
     } catch (err: any) {
         setBookError(err.response?.data?.error || 'Booking failed');
     } finally {
         setIsBooking(false);
     }
  };

  if (!worker) {
    return <div className="p-8 text-center flex flex-col justify-center items-center gap-4"><BackButton /><h2 className="text-2xl font-bold">Loading Worker...</h2></div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto">
      <BackButton />
      {/* Header Profile Section */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <img src={worker.avatar_url || 'https://i.pravatar.cc/200?u='+worker.id} alt={worker.name} className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-slate-50 shadow-lg" />
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
                {worker.name}
                {Boolean(worker.is_verified) && <CheckCircle className="w-6 h-6 text-blue-500" />}
              </h1>
              <p className="text-lg text-slate-600 font-medium">{worker.category} • {worker.experience_level}</p>
            </div>
            <div className="text-center bg-slate-50 p-3 rounded-2xl border min-w-[120px]">
              <p className="text-3xl font-black text-slate-900">${worker.hourly_rate}</p>
              <p className="text-sm font-medium text-slate-500">per hour</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 justify-center md:justify-start text-slate-700">
            <span className="flex items-center gap-1.5 font-bold">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {worker.rating} <span className="text-slate-400 font-normal">({worker.reviewsCount} reviews)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-5 h-5 text-slate-400" />
              Local
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-xl">🗣️</span> English, Spanish
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-xl">⚡</span> 1hr Response
            </span>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
            {worker.skills?.map((skill) => (
              <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About & Video Demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <section className="bg-white p-6 rounded-3xl border shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About Me</h2>
            <p className="text-slate-600 leading-relaxed">{worker.bio}</p>
          </section>

          {/* Portfolio Mocks */}
          <section className="bg-white p-6 rounded-3xl border shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Portfolio Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <img src={`https://images.unsplash.com/photo-1581092918056-0c4c3cb377fa?w=300&h=300&fit=crop&random=${worker.id}1`} alt="Work sample" className="w-full aspect-square object-cover rounded-xl hover:scale-105 transition-transform" />
               <img src={`https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=300&fit=crop&random=${worker.id}2`} alt="Work sample 2" className="w-full aspect-square object-cover rounded-xl hover:scale-105 transition-transform" />
               <img src={`https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop&random=${worker.id}3`} alt="Work sample 3" className="w-full aspect-square object-cover rounded-xl hover:scale-105 transition-transform" />
            </div>
          </section>

          {worker.video_url && (
            <section className="bg-white p-6 rounded-3xl border shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" /> Video Profile Demo
              </h2>
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner">
                <video controls className="w-full h-full object-cover">
                  <source src={worker.video_url} type="video/mp4" />
                </video>
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="bg-white p-6 rounded-3xl border shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Reviews</h2>
            <div className="flex flex-col gap-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">User {review.client_id}</span>
                    <span className="text-xs text-slate-500">{new Date(review.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-slate-500 italic text-sm">No reviews yet for this worker.</p>
              )}
            </div>
          </section>
        </div>

        {/* Booking Sidebar */}
        <div className="flex flex-col gap-4">
          <section className="bg-white p-6 rounded-3xl border shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Book Now</h2>
            
            {bookSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4 transform scale-100 animate-bounce-in">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="w-10 h-10 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Booking Confirmed!</h2>
                        <p className="text-slate-500 font-medium">{bookSuccess}</p>
                        <Link to="/bookings" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 transition">
                            View My Bookings
                        </Link>
                        <button onClick={() => setBookSuccess('')} className="text-slate-400 font-bold text-sm mt-2">Dismiss</button>
                    </div>
                </div>
            )}
            
            <div className="flex flex-col gap-3 mb-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date & Time</label>
                    <input 
                        type="datetime-local" 
                        value={jobDate}
                        onChange={e => setJobDate(e.target.value)}
                        className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
                    <select 
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value as 'wallet' | 'skill_exchange')}
                        className="w-full border bg-slate-50 p-3 rounded-xl focus:ring-primary outline-none"
                    >
                        <option value="wallet">Pay with Wallet (${worker.hourly_rate * 2})</option>
                        <option value="skill_exchange">Skill Exchange (Barter)</option>
                    </select>
                </div>
            </div>
            {bookError && <p className="text-red-500 text-sm mb-3 font-semibold">{bookError}</p>}
            
            <button 
                onClick={handleBook}
                disabled={isBooking}
                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-1"
            >
            {isBooking ? 'Processing...' : (paymentMethod === 'skill_exchange' ? 'Request Exchange' : `Book for $${worker.hourly_rate * 2}`)}
            </button>
            {!user && <p className="text-xs text-red-500 text-center mt-3 font-bold">You must be logged in to book.</p>}
            {user && paymentMethod === 'wallet' && <p className="text-xs text-slate-500 text-center mt-3 font-medium">Current Balance: ${user.wallet_balance?.toFixed(2)}</p>}
            
            {/* Added Message Button for Realtime feature */}
            {user && (
                 <Link to={`/messages?user_id=${worker.user_id || worker.id}`} className="mt-4 w-full bg-white border-2 border-slate-200 text-slate-800 font-bold text-sm py-3 rounded-xl hover:bg-slate-50 transition flex items-center justify-center">
                    Message {worker.name.split(' ')[0]}
                 </Link>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
