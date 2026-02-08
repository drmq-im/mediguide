import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

const LanguageSwitcher = ({ className }) => {
  // Kết nối trực tiếp với bộ điều khiển ngôn ngữ
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit select-none", className)}>
      {/* Icon Globe trang trí */}
      <div className="px-2 text-slate-400">
        <Globe size={16} strokeWidth={2.5} />
      </div>

      {/* Nút chọn Tiếng Việt */}
      <button
        type="button"
        onClick={() => setLanguage('vi')}
        className={cn(
          "px-3 py-1.5 text-xs font-black rounded-lg transition-all duration-300",
          language === 'vi' 
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        VI
      </button>

      {/* Vách ngăn thẩm mỹ */}
      <div className="w-px h-3 bg-slate-200 mx-1"></div>

      {/* Nút chọn Tiếng Anh */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={cn(
          "px-3 py-1.5 text-xs font-black rounded-lg transition-all duration-300",
          language === 'en' 
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;