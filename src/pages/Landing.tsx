import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, UserPlus, ShieldCheck, Star } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=2070&q=80" 
            alt="Workers collaborating" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6 md:px-12 py-20 z-10">
        
        {/* Left Side: Hero Copy */}
        <div className="flex flex-col gap-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm mx-auto lg:mx-0 w-fit shadow-sm animate-fade-in-up">
               <ShieldCheck className="w-5 h-5 text-blue-600" /> Trusted by 10,000+ Verified Locals
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
            Trade Skills. <br/><span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Save Money.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Whether you need a leaky pipe fixed or tutoring for your kids, book a local pro instantly. Pay with cash or <strong className="text-slate-900">Exchange Your Own Skills</strong> to get it done for free.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700 justify-center lg:justify-start">
             <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><Star className="w-4 h-4 text-amber-500 fill-amber-500"/> Verified Pros</span>
             <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><span className="text-green-500">💬</span> Real-time Chat</span>
             <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><span className="text-purple-500">🤝</span> Zero-Fee Bartering</span>
          </div>
        </div>

        {/* Right Side: Role Selection Cards */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto lg:mx-0 relative lg:ml-auto">
            
          <Link 
            to="/signup?role=client" 
            className="group flex items-center gap-6 bg-white p-6 rounded-3xl shadow-xl border-2 border-transparent hover:border-primary/30 transition-all transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
              <UserPlus className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">I want to hire</h2>
              <p className="text-slate-500 font-medium text-sm">Find skilled local workers</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
          </Link>

          <Link 
            to="/signup?role=worker" 
            className="group flex items-center gap-6 bg-slate-900 p-6 rounded-3xl shadow-xl border-2 border-transparent hover:border-slate-700 transition-all transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-slate-800 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-sm">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">I want to work</h2>
              <p className="text-slate-400 font-medium text-sm">Offer your skills & earn</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-white transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border text-center font-semibold text-slate-600 shadow-sm mt-2">
              Already have an account? <Link to="/login" className="text-primary hover:text-blue-700 ml-1">Log in here</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
