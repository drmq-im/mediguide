import React, { useState } from 'react';
import { X, Search, BookOpen, ChevronRight, Stethoscope, Pill, AlertTriangle } from 'lucide-react';
import Input from '../ui/Input';

const MedicalLibraryModal = ({ isOpen, onClose, medicalData, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Lọc dữ liệu
  const filtered = (medicalData || []).filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <BookOpen size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-800">Thư viện Kiến thức Y khoa</h3>
                    <p className="text-xs text-slate-500 font-medium">Cập nhật từ Bộ Y Tế & Hiệp hội</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
            <Input 
                placeholder="Tìm tên bệnh, triệu chứng..." 
                icon={Search} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
            />
        </div>

        {/* List Content */}
        <div className="overflow-y-auto flex-1 p-4 bg-slate-50/50">
            {filtered.length > 0 ? (
                <div className="space-y-4">
                    {filtered.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-lg font-bold text-blue-700">{item.title}</h4>
                                    <p className="text-xs text-slate-400 font-mono">{item.group} | {item.source}</p>
                                </div>
                                <button 
                                    onClick={() => onSelect && onSelect(item)}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100"
                                >
                                    Chọn bệnh này
                                </button>
                            </div>

                            {/* Definition */}
                            <p className="text-sm text-slate-600 italic mb-4 border-l-2 border-blue-200 pl-3">
                                {item.definition}
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                {/* Triệu chứng */}
                                {item.symptoms && (
                                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                                        <strong className="text-orange-700 flex items-center gap-1 mb-2">
                                            <AlertTriangle size={14}/> Triệu chứng
                                        </strong>
                                        <ul className="list-disc pl-4 space-y-1 text-slate-700">
                                            {item.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Điều trị */}
                                {item.treatment_steps && (
                                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <strong className="text-green-700 flex items-center gap-1 mb-2">
                                            <Pill size={14}/> Hướng điều trị
                                        </strong>
                                        <ul className="list-decimal pl-4 space-y-1 text-slate-700">
                                            {item.treatment_steps.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    <p>Không tìm thấy kết quả.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MedicalLibraryModal;