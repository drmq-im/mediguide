import React, { useState } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import SectionLabel from '../ui/SectionLabel';
import Toast from '../ui/Toast';
import { useLanguage } from '../../contexts/LanguageContext';
import { APP_CONFIG } from '../../lib/config'; // Import Config

const sanitizeFileName = (name) => {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
};

const FileUploader = ({ label, categoryId, files = [], onUpload, onDelete }) => {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Dùng Config để check size
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) { 
      setErrorMsg(`${t.file_size_err} (> ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`); 
      return; 
    }

    // 2. Dùng Config để check type (Optional)
    if (!APP_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMsg("Định dạng file không được hỗ trợ.");
      return;
    }

    setUploading(true); 
    setErrorMsg(null);
    try {
      const safeName = sanitizeFileName(file.name);
      // Thêm user_id vào path để đảm bảo RLS hoạt động tốt nhất
      const { data: { user } } = await supabase.auth.getUser();
      const filePath = `${user.id}/${categoryId}/${Date.now()}_${safeName}`;

      const { data, error } = await supabase.storage.from('workups').upload(filePath, file);
      if (error) throw error;
      
      onUpload(categoryId, { name: file.name, path: data.path, type: file.type });
    } catch (error) {
      console.error("Upload Error:", error); 
      setErrorMsg("Upload failed: " + error.message);
    } finally {
      setUploading(false); 
      e.target.value = null;
    }
  };

  const openFile = async (path) => {
    try {
        const { data } = await supabase.storage.from('workups').createSignedUrl(path, 3600);
        if (data?.signedUrl) window.open(data.signedUrl, '_blank');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="mb-4">
      {errorMsg && <Toast message={errorMsg} type="error" onClose={() => setErrorMsg(null)} />}
      <div className="flex justify-between items-center mb-2">
        <SectionLabel label={label} />
        <label className={`cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1 transition border border-blue-100 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? <Loader2 size={12} className="animate-spin"/> : <UploadCloud size={12}/>} 
          {uploading ? t.uploading || "Đang tải..." : t.upload || "Tải lên"}
          <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading}/>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {files.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-300 text-xs shadow-sm hover:border-blue-400 transition-colors">
            <button type="button" onClick={() => openFile(f.path)} className="flex items-center gap-2 truncate text-gray-700 hover:text-blue-600">
                <File size={14}/> <span className="truncate max-w-[140px] font-medium">{f.name}</span>
            </button>
            <button type="button" onClick={() => onDelete(categoryId, idx)} className="text-red-400 hover:text-red-600 p-1"><X size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;