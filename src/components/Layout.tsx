import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto md:p-6 pb-20 md:pb-6 relative overflow-x-hidden">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
