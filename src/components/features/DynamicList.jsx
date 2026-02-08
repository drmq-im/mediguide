import React, { useState } from 'react';
import { Trash2, Plus, Pill, Activity, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

const DynamicList = ({ items = [], onChange, type = 'med' }) => {
  const { t } = useLanguage();
  
  // State quản lý dòng đang nhập
  const [newItem, setNewItem] = useState({ name: '', route: '', dose: '', freq: '' });
  const [error, setError] = useState(null);

  // Xử lý thêm dòng mới
  const handleAdd = () => {
    // Validation: Bắt buộc phải có tên
    if (!newItem.name.trim()) {
      setError(type === 'med' ? "Vui lòng nhập tên thuốc!" : "Vui lòng nhập nội dung!");
      return;
    }
    
    // Thêm vào danh sách cha
    onChange([...items, newItem]);
    
    // Reset form & xóa lỗi
    setNewItem({ name: '', route: '', dose: '', freq: '' });
    setError(null);
  };

  // Xử lý xóa dòng
  const handleRemove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  // UX: Nhấn Enter ở ô cuối cùng để thêm nhanh
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  // Cấu hình Labels & Placeholders dựa trên loại (Thuốc hay Theo dõi)
  const config = type === 'med' ? {
    icon: Pill,
    labels: [
      t.med_name || "Tên thuốc & Hàm lượng", 
      t.med_dose || "Liều lượng", 
      t.med_route || "Đường dùng"
    ],
    placeholders: [
      t.ph_med_name || "VD: Panadol 500mg...", 
      t.ph_med_dose || "VD: 1 viên - 0 - 1 viên", 
      t.ph_med_route || "VD: Uống sau ăn"
    ],
    btnText: t.add_med || "Thêm thuốc"
  } : {
    icon: Activity,
    labels: [
      t.mon_name || "Mục tiêu", 
      t.mon_freq || "Tần suất", 
      ""
    ], // Monitoring chỉ có 2 cột
    placeholders: [
      t.ph_mon_name || "VD: SpO2 > 96%", 
      t.ph_mon_freq || "VD: Mỗi 4 giờ", 
      ""
    ],
    btnText: t.add_mon || "Thêm mục tiêu"
  };

  return (
    <div className="space-y-4">
      
      {/* 1. DANH SÁCH ĐÃ THÊM (HIỂN THỊ DẠNG THẺ) */}
      {items.length > 0 && (
        <div className="grid gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="group flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all animate-in slide-in-from-bottom-2">
              {/* Số thứ tự */}
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5 shrink-0 border border-blue-100">
                {idx + 1}
              </div>
              
              {/* Nội dung chi tiết */}
              <div className="flex-1 grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-12 md:col-span-5 font-bold text-slate-800 break-words">
                    {item.name}
                </div>
                <div className="col-span-6 md:col-span-4 text-slate-600 font-medium bg-slate-50 px-2 rounded w-fit border border-slate-100">
                    {type === 'med' ? (item.dose || "---") : (item.freq || "---")}
                </div>
                {type === 'med' && (
                    <div className="col-span-6 md:col-span-3 text-slate-500 italic">
                        {item.route}
                    </div>
                )}
              </div>

              {/* Nút xóa */}
              <button 
                type="button" 
                onClick={() => handleRemove(idx)}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                title="Xóa dòng này"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. KHU VỰC NHẬP MỚI (INPUT FORM) */}
      <div className={cn(
        "bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 focus-within:bg-blue-50/30",
        error ? "border-red-300 bg-red-50/30" : ""
      )}>
        <div className="grid grid-cols-12 gap-3 items-end">
            
            {/* Ô 1: Tên thuốc */}
            <div className="col-span-12 md:col-span-5">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block pl-1">
                    {config.labels[0]} <span className="text-red-500">*</span>
                </label>
                <input 
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:font-normal placeholder:text-slate-400" 
                    placeholder={config.placeholders[0]} 
                    value={newItem.name} 
                    onChange={e => {
                        setNewItem({...newItem, name: e.target.value});
                        if (error) setError(null);
                    }} 
                />
            </div>

            {/* Ô 2: Liều lượng / Tần suất */}
            <div className="col-span-6 md:col-span-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block pl-1">
                    {config.labels[1]}
                </label>
                <input 
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                    placeholder={config.placeholders[1]} 
                    value={type === 'med' ? newItem.dose : newItem.freq} 
                    onChange={e => setNewItem(type === 'med' ? {...newItem, dose: e.target.value} : {...newItem, freq: e.target.value})} 
                />
            </div>

            {/* Ô 3: Đường dùng (Chỉ hiện cho thuốc) */}
            {type === 'med' && (
                <div className="col-span-6 md:col-span-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block pl-1">
                        {config.labels[2]}
                    </label>
                    <input 
                        className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                        placeholder={config.placeholders[2]} 
                        value={newItem.route} 
                        onChange={e => setNewItem({...newItem, route: e.target.value})}
                        onKeyDown={handleKeyDown} 
                    />
                </div>
            )}

            {/* Nút Thêm */}
            <div className={cn("col-span-12 md:col-span-1", type !== 'med' && "md:col-span-4")}>
                <button 
                    type="button" 
                    onClick={handleAdd} 
                    className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                    title={config.btnText}
                >
                    <Plus size={20} strokeWidth={3} />
                </button>
            </div>
        </div>
        
        {/* Thông báo lỗi inline */}
        {error && (
            <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                <AlertCircle size={12}/> {error}
            </p>
        )}
      </div>
    </div>
  );
};

export default DynamicList;