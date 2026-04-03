import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
    const navigate = useNavigate();
    
    return (
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium py-2 px-4 bg-white border rounded-full shadow-sm hover:shadow transition-all w-max mb-6"
        >
            <ArrowLeft className="w-4 h-4" /> Back
        </button>
    );
}
