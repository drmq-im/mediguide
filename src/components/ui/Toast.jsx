import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={cn(
      "fixed bottom-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300",
      type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
    )}>
      {type === 'error' ? <AlertTriangle size={20}/> : <CheckCircle2 size={20}/>}
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X size={16}/>
      </button>
    </div>
  );
};

export default Toast;