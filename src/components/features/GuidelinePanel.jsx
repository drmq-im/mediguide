import React, { useEffect, useState } from 'react';
import { BookOpen, Award, ExternalLink, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import GuidelineDetailModal from './GuidelineDetailModal';

const GuidelinePanel = ({ icd10Value }) => {
  const { t } = useLanguage();
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState(null);

  // Effect: Truy vấn phác đồ mỗi khi mã ICD-10 thay đổi
  useEffect(() => {
    const fetchMatchedGuidelines = async () => {
      if (!icd10Value) {
        setGuidelines([]);
        return;
      }

      setLoading(true);
      try {
        // Trích xuất mã code (VD: "I10 - Tăng huyết áp" => "I10")
        const code = icd10Value.split(' - ')[0].trim();

        const { data, error } = await supabase
          .from('guidelines')
          .select('*')
          .contains('icd10_codes', [code]); // Lọc các phác đồ có chứa mã ICD này

        if (error) throw error;
        setGuidelines(data || []);
      } catch (err) {
        console.error("Lỗi khi tải Guideline:", err.message);
        setGuidelines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedGuidelines();
  }, [icd10Value]);

  // Nếu không có chẩn đoán hoặc đang tải dữ liệu
  if (!icd10Value) return null;
  
  if (loading) {
    return (
      <div className="mt-6 flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Loader2 className="animate-spin text-blue-500 mr-2" size={20} />
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tìm phác đồ phù hợp...</span>
      </div>
    );
  }

  if (guidelines.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Tiêu đề Panel */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-slate-800 font-black">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <BookOpen size={18} />
          </div>
          <span className="uppercase tracking-tight text-sm">
              {t.guideline_suggestions || "Khuyến cáo Y khoa dựa trên chẩn đoán"}
          </span>
        </div>
        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
            {guidelines.length} KẾT QUẢ
        </span>
      </div>

      {/* Danh sách các Card Guideline */}
      <div className="grid grid-cols-1 gap-4">
        {guidelines.map((gl) => (
          <div 
            key={gl.id} 
            onClick={() => setSelectedGuideline(gl)} // Mở Modal khi click vào Card
            className="group relative bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-all duration-300 overflow-hidden"
          >
            {/* Hiệu ứng trang trí góc Card */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -mr-8 -mt-8"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-black text-slate-900 text-lg group-hover:text-blue-700 transition-colors leading-tight">
                    {gl.disease_name}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                        <Award size={10} className="text-yellow-400" /> {gl.source_name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                        Năm cập nhật: {gl.year}
                    </span>
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                <ChevronRight size={20} />
              </div>
            </div>

            {/* Tóm tắt nội dung */}
            <div className="relative">
                <p className="text-sm text-slate-500 leading-relaxed pl-4 border-l-2 border-blue-200 italic group-hover:text-slate-700 transition-colors">
                {gl.quick_summary}
                </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-50 flex justify-end items-center">
                <span className="text-[10px] font-black text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    {t.view_detail || "XEM CHI TIẾT PHÁC ĐỒ"} <ExternalLink size={12}/>
                </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết*/}
      <GuidelineDetailModal 
        isOpen={!!selectedGuideline}
        onClose={() => setSelectedGuideline(null)}
        guideline={selectedGuideline}
      />
    </div>
  );
};

export default GuidelinePanel;