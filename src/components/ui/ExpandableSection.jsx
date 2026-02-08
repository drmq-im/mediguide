import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ExpandableSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden mb-3 bg-white">
      <button 
        type="button"
        onClick={onToggle} 
        className={`w-full flex items-center justify-between p-4 text-left font-bold text-sm transition-colors ${
          isOpen ? 'bg-blue-50 text-blue-800' : 'bg-white text-gray-800 hover:bg-gray-50'
        }`}
      >
        <span>{title}</span> 
        {isOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;