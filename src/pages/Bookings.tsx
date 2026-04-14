import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { BackButton } from '../components/BackButton';
import { Star } from 'lucide-react';

export function Bookings() {
  const user = useAuthStore(state => state.user);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (user) {
      api.get(`/bookings/client/${user.id}`).then(res => {
        setBookings(res.data);
      }).catch(console.error);
    }
  };

  const submitReview = async (workerId: number) => {
      setReviewStatus('Submitting...');
      try {
          await api.post('/reviews', {
              client_id: user?.id,
              worker_id: workerId,
              rating,
              comment
          });
          setReviewStatus('Review saved!');
          setTimeout(() => {
              setReviewingId(null);
              setReviewStatus('');
              setRating(5);
              setComment('');
          }, 2000);
      } catch (err) {
          setReviewStatus('Failed to submit review.');
      }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto mb-20">
      <BackButton />
      <h1 className="text-3xl font-extrabold mb-6 mt-4">Your Bookings & Tracking</h1>
      
      {bookings.length === 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-6 text-center text-slate-500 py-12">
            <h2 className="text-xl font-bold text-slate-900 mb-2">No active bookings</h2>
            <p>You haven't booked any workers yet.</p>
          </div>
      ) : (
          <div className="flex flex-col gap-6">
              {bookings.map(b => (
                  <div key={b.id} className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
                     <div className="flex-1 w-full">
                         <div className="flex justify-between items-center w-full mb-2">
                             <h3 className="font-bold text-xl text-slate-900">{b.worker_name}</h3>
                             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${b.status === 'pending' ? 'bg-amber-100 text-amber-700' : b.status === 'completed' ? 'bg-blue-100 text-blue-700' : b.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {b.status}
                             </span>
                         </div>
                         <p className="text-primary font-bold text-sm bg-primary/10 w-fit px-2 py-0.5 rounded-md mb-2">{b.category}</p>
                         <p className="text-slate-500 text-sm font-medium">Job Date: {new Date(b.job_date).toLocaleString()}</p>
                     </div>
                     <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl border md:border-0 border-slate-200">
                         {b.payment_method === 'skill_exchange' ? (
                             <p className="font-black text-purple-700 uppercase">Skill Exchange</p>
                         ) : (
                             <p className="font-black text-2xl text-slate-900">${b.total_price}</p>
                         )}
                         {b.status === 'completed' && reviewingId !== b.id && (
                             <button onClick={() => setReviewingId(b.id)} className="mt-3 text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 w-full md:w-auto">
                                Leave a Review
                             </button>
                         )}
                     </div>
                     
                     {reviewingId === b.id && (
                         <div className="w-full mt-4 p-4 border-t border-slate-200 pt-4 bg-slate-50 rounded-xl flex flex-col gap-3">
                             <h4 className="font-bold text-slate-800">Rate Your Experience with {b.worker_name}</h4>
                             <div className="flex gap-1">
                                 {[1,2,3,4,5].map(star => (
                                     <Star 
                                        key={star} 
                                        className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                                        onClick={() => setRating(star)}
                                     />
                                 ))}
                             </div>
                             <textarea 
                                rows={2}
                                placeholder="How was the work?"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-primary/50"
                             />
                             {reviewStatus && <p className="text-sm font-bold text-primary">{reviewStatus}</p>}
                             <div className="flex gap-2">
                                 <button onClick={() => submitReview(b.worker_id)} className="bg-primary text-white font-bold px-4 py-2 rounded-xl shadow active:scale-95 transition-transform outline-none">Submit Review</button>
                                 <button onClick={() => setReviewingId(null)} className="text-slate-500 font-bold px-4 py-2 rounded-xl border hover:bg-slate-200 active:scale-95 transition-transform outline-none">Cancel</button>
                             </div>
                         </div>
                     )}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}
