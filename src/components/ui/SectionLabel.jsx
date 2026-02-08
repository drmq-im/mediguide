import React from 'react';
import { cn } from '../../lib/utils';

const SectionLabel = ({ label, required, className }) => {
  if (!label) return null;
  
  return (
    <label className={cn(
      "text-[12px] font-bold text-gray-600 uppercase tracking-wide mb-2 block pl-1",
      className
    )}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
};

export default SectionLabel;