import React from 'react';
import { cn } from '../../lib/utils';
import SectionLabel from './SectionLabel';

const Input = React.forwardRef(({ 
  label, 
  placeholder, 
  type = "text", 
  className, 
  icon: Icon, 
  required, 
  error, 
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && <SectionLabel label={label} required={required} />}
      <div className="relative group">
        <input 
          ref={ref}
          type={type}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-semibold transition-all outline-none",
            "placeholder:text-slate-400 placeholder:font-normal",
            "hover:bg-white hover:border-slate-300",
            "focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
            error && "border-red-300 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-200"
          )}
          placeholder={placeholder} 
          {...props}
        />
        {Icon && (
          <div className="absolute right-4 top-3.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
            <Icon size={20}/>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
          • {error.message}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input"; // Thêm displayName để tránh cảnh báo ESLint

export default Input;