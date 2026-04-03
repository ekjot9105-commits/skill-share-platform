import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { BackButton } from '../components/BackButton';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      login(res.data);
      navigate(res.data.role === 'worker' ? '/worker-dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 md:p-8 bg-white rounded-3xl shadow-sm border mt-10 relative">
      <div className="absolute top-4 left-4"><BackButton /></div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6 text-center mt-12">Welcome Back</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-semibold">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full border bg-slate-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
          <input 
            type="password" 
            className="w-full border bg-slate-50 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" 
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
        </div>
        <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition shadow-md mt-4">
          Login
        </button>
      </form>
      
      <p className="text-center mt-6 text-slate-600">
        Don't have an account? <Link to="/signup" className="text-primary font-bold">Sign up</Link>
      </p>
    </div>
  );
}
