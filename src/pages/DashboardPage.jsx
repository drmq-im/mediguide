import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Clock, ChevronRight, User, 
  FileBarChart, CheckCircle, FileEdit, LayoutGrid, Trash2, FolderOpen
} from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecordManager } from '../hooks/useRecordManager';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import Toast from '../components/ui/Toast';

// Thẻ thống kê (Style mới)
const StatCard = ({ label, count, icon: Icon, colorClass }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
        <div className={cn("p-4 rounded-2xl shadow-sm", colorClass)}>
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-800">{count}</p>
        </div>
    </div>
);

const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { fetchList, deleteRecord, loading } = useRecordManager();

  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load Data
  const loadRecords = async () => {
    const result = await fetchList(searchQuery);
    if (result.success) {
      setRecords(result.data);
    } else {
      setToast({ message: "Lỗi tải danh sách: " + result.message, type: 'error' });
    }
    setInitialLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => { loadRecords(); }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa hồ sơ này?")) return;
    const result = await deleteRecord(id);
    if (result.success) {
      setToast({ message: result.message, type: 'success' });
      loadRecords();
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  const stats = {
    total: records.length,
    today: records.filter(r => new Date(r.updated_at).toDateString() === new Date().toDateString()).length,
    draft: records.filter(r => r.status === 'draft').length
  };

  return (
    <div className="space-y-8">
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      
      {/* HEADER: Tiêu đề & Công cụ */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Tổng quan</h2>
           <p className="text-slate-500 font-medium">Theo dõi tình hình bệnh nhân và hồ sơ.</p>
        </div>
        <div className="flex gap-3">
            <LanguageSwitcher />
        </div>
      </div>
      
      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Tổng hồ sơ" count={stats.total} icon={FileBarChart} colorClass="bg-blue-50 text-blue-600" />
          <StatCard label="Hôm nay" count={stats.today} icon={Clock} colorClass="bg-purple-50 text-purple-600" />
          <StatCard label="Chờ xử lý" count={stats.draft} icon={FileEdit} colorClass="bg-orange-50 text-orange-600" />
      </div>

      {/* SEARCH BAR & BUTTON */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Tìm kiếm bệnh nhân..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <button 
            onClick={() => navigate('/record/new')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
            <Plus size={20} /> {t.newRecord}
        </button>
      </div>

      {/* RECORD LIST */}
      {initialLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)}
         </div>
      ) : records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <div 
                key={record.id} 
                onClick={() => navigate(`/record/${record.id}`)}
                className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 cursor-pointer transition-all duration-300 relative"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-bold transition-colors">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                                {record.patient_name || "Không tên"}
                            </h3>
                            <p className="text-xs text-slate-400 font-bold">{formatDate(record.updated_at)}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                    <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5",
                        record.status === 'submitted' ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                    )}>
                        {record.status === 'submitted' ? <CheckCircle size={12}/> : <FileEdit size={12}/>}
                        {record.status === 'submitted' ? t.submit : t.draft}
                    </span>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                        <button 
                            onClick={(e) => handleDelete(e, record.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-200">
                <FolderOpen size={48} strokeWidth={1.5} />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2">Chưa có dữ liệu</h3>
             <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">
                {searchQuery ? "Không tìm thấy kết quả phù hợp." : "Hãy bắt đầu bằng việc tạo hồ sơ bệnh án đầu tiên."}
             </p>
             <button 
                onClick={() => navigate('/record/new')}
                className="text-blue-600 font-bold hover:underline"
             >
                + Tạo hồ sơ ngay
             </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;