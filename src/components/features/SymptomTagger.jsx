import React, { useState } from 'react';
import { X } from 'lucide-react';
import SectionLabel from '../ui/SectionLabel';

const SymptomTagger = ({ tags = [], onChange }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault(); // Chặn submit form
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2 mb-4">
      <SectionLabel label="Tags Triệu chứng (Gõ & Enter)" />
      <div className="bg-white border border-gray-300 rounded-xl p-2 flex flex-wrap gap-2 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
        {tags.map((tag, index) => (
          <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 border border-blue-100 animate-in zoom-in duration-200">
            {tag} 
            <button type="button" onClick={() => removeTag(index)} className="hover:text-red-500 transition-colors">
                <X size={14}/>
            </button>
          </span>
        ))}
        <input 
            className="flex-1 min-w-[160px] bg-transparent outline-none px-2 py-1.5 text-sm font-medium text-gray-800 placeholder-gray-400" 
            placeholder="Gõ triệu chứng (VD: Sốt cao)..." 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default SymptomTagger;