import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToggleGroup = ({ options, selected, onChange, labels }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt, idx) => {
        const isSelected = selected === opt;
        return (
          <button 
            key={idx} 
            type="button" // Quan trọng để không kích hoạt submit form
            onClick={() => onChange(opt)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg border font-bold text-sm transition-all shadow-sm",
              isSelected 
                ? "bg-blue-600 border-blue-600 text-white" 
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
          >
            {isSelected && <CheckCircle2 size={16}/>} 
            <span>{labels ? labels[idx] : opt}</span>
          </button>
        )
      })}
    </div>
  );
};

export default ToggleGroup;