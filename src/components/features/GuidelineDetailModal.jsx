import React from 'react';
import { X, Award, Clock, FileText, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const GuidelineDetailModal = ({ isOpen, onClose, guideline }) => {
  if (!isOpen || !guideline) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white">
        
        {/* Header chuyên nghiệp */}
        <div className="relative p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start pr-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                  <Award size={12}/> {guideline.source_name || 'Nguồn chính thống'}
                </span>
                <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                  <Clock size={12}/> {guideline.year || '2024'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {guideline.title || guideline.disease_name}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Box tóm tắt */}
          <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl mb-8">
            <h4 className="text-blue-700 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText size={18}/> Tóm tắt khuyến cáo (Quick Summary)
            </h4>
            <p className="text-blue-900 italic mb-0 leading-relaxed font-medium">
              {guideline.quick_summary}
            </p>
          </div>

          {/* Render Markdown từ Database */}
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-a:text-blue-600">
            {/* Nếu có cột full_text_md thì hiển thị, nếu không hiển thị thông báo */}
            {guideline.full_text_md ? (
                <ReactMarkdown>{guideline.full_text_md}</ReactMarkdown>
            ) : (
                <p className="text-slate-400 italic">Chi tiết phác đồ đang được cập nhật...</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] text-slate-400 font-medium italic">
            * Nội dung mang tính chất tham khảo chuyên môn.
          </p>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => window.print()}
            >
              <Download size={14}/> In phác đồ
            </button>
            <button 
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidelineDetailModal;