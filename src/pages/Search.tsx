import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, List, Filter, Star, Info } from 'lucide-react';
import api from '../api';
import { BackButton } from '../components/BackButton';
import type { WorkerProfile } from '../types';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q');
  const aiMatch = searchParams.get('ai_match');
  const categoryParam = searchParams.get('category');
  
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price_low' | 'price_high'
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/workers');
      let data = res.data;
      
      // Simulate AI match backend logic (in a real backend this would use embeddings)
      if (aiMatch) {
         setSearchQuery('Plumber'); // The mock AI assumes leaking pipe -> Plumber
      }
      
      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  let filteredWorkers = workers.filter(w => {
    const searchTarget = (searchQuery || aiMatch || categoryParam || '').toLowerCase();
    
    // Price filter
    if (w.hourly_rate > maxPrice) return false;
    // Rating filter
    if (w.rating < minRating) return false;

    if (!searchTarget) return true;
    return w.name.toLowerCase().includes(searchTarget) || 
           w.category.toLowerCase().includes(searchTarget) ||
           w.skills.some(s => s.toLowerCase().includes(searchTarget));
  });

  // Apply sorting
  if (sortBy === 'rating') filteredWorkers.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'price_low') filteredWorkers.sort((a, b) => a.hourly_rate - b.hourly_rate);
  else if (sortBy === 'price_high') filteredWorkers.sort((a, b) => b.hourly_rate - a.hourly_rate);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-4 mt-2">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 bg-white p-4 rounded-3xl border shadow-sm hidden md:flex flex-col h-fit sticky top-24">
        <BackButton />
        <h2 className="font-bold text-lg mb-4 mt-2 flex items-center gap-2 text-slate-900"><Filter className="w-5 h-5 text-primary"/> Refine Results</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full mt-2 border bg-slate-50 rounded-xl p-2.5 focus:ring-primary focus:outline-none font-medium text-slate-700">
              <option value="rating">Highest Rating</option>
              <option value="price_low">Lowest Price First</option>
              <option value="price_high">Highest Price First</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Minimum Rating</label>
            <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full mt-2 border bg-slate-50 rounded-xl p-2.5 focus:ring-primary focus:outline-none font-medium text-slate-700">
              <option value={0}>Any Rating</option>
              <option value={4}>4 Stars & Up</option>
              <option value={3}>3 Stars & Up</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Max Price (${maxPrice}/hr)</label>
            <input type="range" className="w-full mt-2 accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" min={10} max={200} step={5} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
            <div className="flex justify-between text-xs text-slate-500 font-medium mt-1"><span>$10</span><span>$200</span></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        {aiMatch && (
           <div className="bg-gradient-to-r from-purple-100 to-indigo-50 border border-purple-200 text-purple-900 p-4 rounded-2xl flex items-center gap-3">
              <div className="bg-purple-200 p-2 rounded-full"><Info className="w-5 h-5 text-purple-700" /></div>
              <div>
                 <p className="font-bold">AI Skill Match Active</p>
                 <p className="text-sm">Based on issue: "{aiMatch}", we filtered top Plumbers near you.</p>
              </div>
           </div>
        )}
        
        {/* Mobile Filters and Toggle */}
        <div className="flex gap-2 items-center bg-white p-2 border rounded-full shadow-sm">
          <div className="md:hidden ml-2"><BackButton /></div>
          <input 
            type="text" 
            placeholder="Search by name, skill, category..." 
            className="flex-1 bg-transparent px-4 outline-none font-medium h-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setView('list')} className={`p-3 rounded-full transition-colors ${view === 'list' ? 'bg-primary text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><List className="w-5 h-5" /></button>
          <button onClick={() => setView('map')} className={`p-3 rounded-full transition-colors ${view === 'map' ? 'bg-primary text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Map className="w-5 h-5" /></button>
        </div>

        {view === 'map' ? (
          <div className="flex-1 bg-slate-200 rounded-3xl border shadow-inner flex overflow-hidden relative min-h-[400px]">
              <MapContainer center={[35.0, -90.0]} zoom={4} className="w-full h-full">
                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                 {filteredWorkers.map(w => (
                     <Marker key={w.id} position={[w.latitude || 35.0, w.longitude || -90.0]}>
                         <Popup>
                             <div className="flex flex-col gap-2 p-1 min-w-[150px]">
                                 <h3 className="font-bold text-sm m-0">{w.name}</h3>
                                 <p className="text-xs text-slate-500 m-0">{w.category} • ${w.hourly_rate}/hr</p>
                                 <Link to={`/worker/${w.user_id}`} className="bg-primary text-white text-xs text-center p-2 rounded-lg font-bold mt-1 inline-block no-underline">
                                    View Profile
                                 </Link>
                             </div>
                         </Popup>
                     </Marker>
                 ))}
              </MapContainer>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="bg-white p-4 flex gap-4 border rounded-2xl shadow-sm animate-pulse">
                            <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
                            <div className="flex-1 space-y-3 py-1">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : filteredWorkers.map((worker) => (
                  <Link key={worker.id} to={`/worker/${worker.id}`} className="group bg-white p-4 flex gap-4 border rounded-2xl shadow-sm hover:shadow-lg hover:border-primary/30 transition-all transform hover:-translate-y-1 relative overflow-hidden">
                    <img src={worker.avatar_url || 'https://i.pravatar.cc/150'} alt={worker.name} className="w-20 h-20 rounded-xl object-cover relative z-10" />
                    <div className="flex-1 min-w-0 relative z-10">
                      <h3 className="font-bold text-lg truncate text-slate-900 group-hover:text-primary transition-colors">{worker.name}</h3>
                      <p className="font-semibold text-primary mb-1">{worker.category}</p>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                         <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" />{Number(worker.rating).toFixed(1)}</span>
                         <span className="flex items-center gap-1">• {worker.experience_level}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 justify-between z-10 relative">
                       <p className="font-black text-slate-900 border bg-slate-50 px-3 py-1 rounded-lg">${worker.hourly_rate}<span className="text-xs text-slate-500">/hr</span></p>
                    </div>
                  </Link>
                ))}
                {!isLoading && filteredWorkers.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-3xl border text-slate-500 font-medium">No local workers found matching those skills. Try removing some filters.</div>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
