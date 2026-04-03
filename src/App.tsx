import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { SearchPage } from './pages/Search';
import { WorkerProfilePage } from './pages/WorkerProfile';
import { Bookings } from './pages/Bookings';
import { Messages } from './pages/Messages';
import { Wallet } from './pages/Wallet';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LandingPage } from './pages/Landing';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { useAuthStore } from './store/useAuthStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="search" element={<SearchPage />} />
          <Route path="worker/:id" element={<WorkerProfilePage />} />
          
          {/* Protected Routes */}
          <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="worker-dashboard" element={<ProtectedRoute><WorkerDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
