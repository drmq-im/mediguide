import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { cn } from '../../lib/utils';

// Hook để debounce (trì hoãn) việc gọi API khi gõ phím liên tục
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ICD10Search = ({ value, onChange, error }) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500); // Chỉ search sau khi ngừng gõ 0.5s
  const wrapperRef = useRef(null);

  // Đồng bộ giá trị prop 'value' vào state nội bộ
  useEffect(() => {
    if (value !== query) {
        setQuery(value || '');
    }
  }, [value]);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Gọi API tìm kiếm
  useEffect(() => {
    const searchICD10 = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      // Nếu người dùng đang chọn 1 mã cụ thể (VD: "A00"), không search lại để tránh hiện popup
      if (debouncedQuery === value) return;

      setLoading(true);
      setIsOpen(true);
      
      try {
        const { data, error } = await supabase
          .from('icd10_codes')
          .select('code, description')
          .or(`code.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(10); // Chỉ lấy 10 kết quả

        if (!error && data) {
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    searchICD10();
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    setQuery(item.code);
    onChange(item.code); // Trả về mã code cho form cha
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block pl-1">
        Mã ICD-10 <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
              if(results.length > 0) setIsOpen(true);
          }}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all uppercase placeholder:normal-case",
            error && "border-red-300 bg-red-50 text-red-900"
          )}
          placeholder="Gõ mã hoặc tên bệnh (VD: J00)..."
        />
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        {loading && <Loader2 className="absolute right-3 top-3 text-blue-500 animate-spin" size={18} />}
      </div>

      {error && (
        <p className="text-red-600 text-[11px] font-bold mt-1 flex items-center gap-1">
          • {error.message}
        </p>
      )}

      {/* --- DROPDOWN KẾT QUẢ --- */}
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 origin-top-left">
          {results.map((item) => (
            <li
              key={item.code}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-none group transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                    <span className="font-black text-blue-700 block">{item.code}</span>
                    <span className="text-xs text-slate-600 font-medium group-hover:text-slate-900">{item.description}</span>
                </div>
                {value === item.code && <Check size={16} className="text-green-500 mt-1"/>}
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {isOpen && !loading && debouncedQuery.length >= 2 && results.length === 0 && (
         <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center">
            <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
                <AlertCircle size={14}/> Không tìm thấy mã bệnh này.
            </p>
         </div>
      )}
    </div>
  );
};

export default ICD10Search;