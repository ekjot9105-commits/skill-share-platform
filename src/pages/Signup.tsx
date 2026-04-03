import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { BackButton } from '../components/BackButton';

export function Signup() {
  const [searchParams] = useSearchParams();
  const initRole = searchParams.get('role') === 'worker' ? 'worker' : 'client';
  const [role, setRole] = useState<'client' | 'worker'>(initRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Worker specific
  const [category, setCategory] = useState('Plumber');
  const [hourlyRate, setHourlyRate] = useState(25);
  const [experience, setExperience] = useState('Intermediate');
  const [skills, setSkills] = useState('');
  
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { name, email, password, role };
      if (role === 'worker') {
        payload.workerData = {
          category,
          hourly_rate: hourlyRate,
          experience_level: experience,
          latitude: (Math.random() * (40 - 30) + 30).toFixed(4), // Mock random location
          longitude: (Math.random() * (-80 - -120) + -120).toFixed(4),
          skills: skills.split(',').map(s => s.trim()),
          bio: 'I am a highly motivated local worker looking to help you out.',
        };
      }
      
      const res = await api.post('/register', payload);
      // Auto-login after signup
      login(res.data);
      navigate(res.data.role === 'worker' ? '/worker-dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 md:p-8 bg-white rounded-3xl shadow-sm border mt-10 relative">
      <div className="absolute top-4 left-4"><BackButton /></div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6 text-center mt-12">Join SkillShare</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-semibold">{error}</div>}
      
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button 
          type="button"
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${role === 'client' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}
          onClick={() => setRole('client')}
        >
          I want to hire
        </button>
        <button 
           type="button"
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${role === 'worker' ? 'bg-primary text-white shadow' : 'text-slate-500'}`}
          onClick={() => setRole('worker')}
        >
          I want to work
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div><label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label><input type="text" className="w-full border bg-slate-50 p-3 rounded-xl" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-1">Email</label><input type="email" className="w-full border bg-slate-50 p-3 rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div><label className="block text-sm font-semibold text-slate-700 mb-1">Password</label><input type="password" className="w-full border bg-slate-50 p-3 rounded-xl" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></div>
        
        {role === 'worker' && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col gap-4 mt-2">
            <h3 className="font-bold text-primary mb-2">Worker Profile Creation</h3>
            <div className="flex gap-4">
              <div className="flex-1"><label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <select className="w-full border bg-white p-3 rounded-xl" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Plumber</option><option>Electrician</option><option>Tutor</option><option>Cleaner</option><option>Driver</option>
                </select>
              </div>
              <div className="flex-1"><label className="block text-sm font-semibold text-slate-700 mb-1">Hourly Rate ($)</label>
                <input type="number" className="w-full border bg-white p-3 rounded-xl" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
              <input type="text" placeholder="e.g. Pipe fitting, Drain cleaning" className="w-full border bg-white p-3 rounded-xl" value={skills} onChange={e => setSkills(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Experience Level</label>
              <select className="w-full border bg-white p-3 rounded-xl" value={experience} onChange={e => setExperience(e.target.value)}>
                  <option>Beginner</option><option>Intermediate</option><option>Expert</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition shadow-md mt-4">
          Create Account
        </button>
      </form>
      <p className="text-center mt-6 text-slate-600">Already joined? <Link to="/login" className="text-primary font-bold">Log in</Link></p>
    </div>
  );
}
