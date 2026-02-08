import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '../../lib/utils';
import SectionLabel from './SectionLabel';

const TextArea = React.forwardRef(({ 
  label, 
  placeholder, 
  rows = 3, 
  mic = false, 
  className, 
  error,
  onMicClick,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-1 relative w-full mb-4", className)}>
      {label && <SectionLabel label={label} />}
      <div className="relative group">
        <textarea 
          ref={ref}
          rows={rows}
          className={cn(
            "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 font-medium transition-all outline-none resize-none leading-relaxed",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
            error && "border-red-500 bg-red-50/10"
          )}
          placeholder={placeholder} 
          {...props}
        />
        {mic && (
          <button 
            type="button"
            onClick={onMicClick}
            className="absolute right-3 top-3 p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all"
            title="Nhập bằng giọng nói"
          >
            <Mic size={16} />
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>}
    </div>
  );
});

TextArea.displayName = "TextArea";
export default TextArea;