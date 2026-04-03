import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';
import { Plus } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function Wallet() {
  const user = useAuthStore(state => state.user);
  const updateWallet = useAuthStore(state => state.updateWallet);
  const [loading, setLoading] = useState(false);
  const [txHistory, setTxHistory] = useState<{title:string, date:string, amount:number, type:'add'|'sub'}[]>([]);

  if (!user) return <div className="p-8 text-center text-primary font-bold">Please login</div>;

  const handleTopUp = async () => {
    setLoading(true);
    try {
        const amount = 50; // Mock fixed topup
        await api.post('/wallet/topup', { user_id: user.id, amount });
        updateWallet(user.wallet_balance + amount);
        setTxHistory([{ title: 'Added Funds', date: new Date().toLocaleDateString(), amount, type: 'add' }, ...txHistory]);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-md mx-auto">
      <BackButton />
      <h1 className="text-3xl font-extrabold mb-6 mt-4 text-center">Wallet</h1>
      
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <p className="text-slate-300 font-medium mb-2 opacity-80">Current Balance</p>
        <p className="text-5xl font-black mb-6">${user.wallet_balance.toFixed(2)}</p>
        
        <button 
           onClick={handleTopUp}
           disabled={loading}
           className="bg-white text-slate-900 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition shadow-md disabled:opacity-50"
        >
          <Plus className="w-5 h-5"/> {loading ? 'Processing...' : 'Add $50 Funds'}
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4 text-slate-900">Recent Transactions</h3>
        <ul className="bg-white border rounded-2xl p-4 divide-y shadow-sm">
          {txHistory.length === 0 && <li className="py-2 text-slate-500 text-sm">No new local session transactions</li>}
          {txHistory.map((tx, i) => (
             <li key={i} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-slate-900">{tx.title}</p>
                  <p className="text-slate-500 font-medium">{tx.date}</p>
                </div>
                <span className={`${tx.type === 'add' ? 'text-green-600' : 'text-slate-900'} font-bold`}>
                  {tx.type === 'add' ? '+' : '-'}${tx.amount.toFixed(2)}
                </span>
             </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
