import React, { useState } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import SectionLabel from '../ui/SectionLabel';
import Toast from '../ui/Toast';
import { useLanguage } from '../../contexts/LanguageContext';
import { APP_CONFIG } from '../../lib/config';

const FileUploader = ({ label, categoryId, files = [], onUpload, onDelete }) => {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) { 
      setErrorMsg(`${t.file_size_err} (> ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`); 
      return; 
    }

    // Check type
    if (!APP_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMsg("Định dạng file không được hỗ trợ.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    
    // Gọi callback lên cha (useRecordManager) để xử lý upload
    try {
        await onUpload(categoryId, file);
    } catch (err) {
        setErrorMsg("Upload thất bại");
    } finally {
        setUploading(false);
    }
  };

  // Hàm mở file: Dùng bucket 'medical-records'
  const openFile = async (path) => {
    try {
        const { data, error } = await supabase.storage
            .from('medical-records') 
            .createSignedUrl(path, 3600); // Link tồn tại 1 giờ

        if (error) throw error;
        if (data?.signedUrl) window.open(data.signedUrl, '_blank');
    } catch (err) {
        console.error("Lỗi mở file:", err);
        setErrorMsg("Không thể mở file này (Hết hạn hoặc không có quyền)");
    }
  };

  return (
    <div className="mb-4">
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg(null)} />}
      <div className="flex justify-between items-center mb-2">
        <SectionLabel label={label} />
        <label className={`cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1 transition border border-blue-100 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 size={12} className="animate-spin"/> : <UploadCloud size={12}/>} 
          {uploading ? (t.uploading || "Đang tải...") : (t.upload || "Tải lên")}
          
          {/* --- ĐOẠN SỬA LỖI: Xóa các dấu gạch chéo ngược (\) thừa --- */}
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={uploading}
          />
          
        </label>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {files.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-300 text-xs shadow-sm hover:border-blue-400 transition-colors">
            <button type="button" onClick={() => openFile(f.path)} className="flex items-center gap-2 truncate text-gray-700 hover:text-blue-600">
                <File size={14}/> <span className="truncate max-w-[140px] font-medium">{f.name}</span>
            </button>
            <button type="button" onClick={() => onDelete(categoryId, idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                <X size={14}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;