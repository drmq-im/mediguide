import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

const TableOfContents = ({ sections }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <nav className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pl-4 border-l border-slate-200">
      <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-4">
        Mục lục nhanh
      </h4>
      <div className="space-y-1">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={cn(
              "group flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-all",
              activeId === id 
                ? "bg-blue-50 text-blue-700 shadow-sm" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {Icon && (
              <Icon 
                size={16} 
                className={cn(
                  "transition-colors", 
                  activeId === id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
            )}
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TableOfContents;