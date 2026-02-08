import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

export const useRecordManager = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const uploadFiles = async (filesMap) => {
    const uploadedUrls = {};
    
    for (const [category, files] of Object.entries(filesMap || {})) {
      if (!files || files.length === 0) continue;
      
      const processedFiles = await Promise.all(files.map(async (fileItem) => {
        if (fileItem.url && !fileItem.file) return fileItem;
        
        const actualFile = fileItem.file || fileItem; 
        if (!actualFile || !(actualFile instanceof File)) return fileItem;

        // --- PHẦN QUAN TRỌNG: TẠO ID THỦ CÔNG ---
        const fileExt = actualFile.name.split('.').pop();
        // Dùng Date.now() để thay thế uuid, đảm bảo không lỗi "n is not a function"
        const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        const fileName = `${uniqueId}.${fileExt}`;
        const filePath = `${category}/${fileName}`;
        // ----------------------------------------

        const { error: uploadError } = await supabase.storage
          .from('workups') 
          .upload(filePath, actualFile);

        if (uploadError) return null;

        const { data: { publicUrl } } = supabase.storage
          .from('workups')
          .getPublicUrl(filePath);

        return {
          name: actualFile.name,
          type: actualFile.type,
          size: actualFile.size,
          url: publicUrl
        };
      }));

      uploadedUrls[category] = processedFiles.filter(f => f !== null);
    }
    return uploadedUrls;
  };

  const saveRecord = async (formData, recordId = null) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vui lòng đăng nhập lại.");

      // Upload file trước khi lưu
      const processedFiles = await uploadFiles(formData.files);
      
      const finalFormData = { ...formData, files: processedFiles };

      const payload = {
        user_id: user.id,
        patient_name: formData.demo?.name || 'Không tên',
        status: formData.plan?.status === 'admitted' ? 'final' : 'draft',
        updated_at: new Date().toISOString(),
        form_data: finalFormData
      };

      let result;
      if (recordId && recordId !== 'new') {
        const { data, error } = await supabase
          .from('records') // Đảm bảo tên bảng là 'records'
          .update(payload).eq('id', recordId).select().single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('records')
          .insert([payload]).select().single();
        if (error) throw error;
        result = data;
      }

      return { success: true, id: result.id, message: "Lưu thành công!" };
    } catch (error) {
      console.error("Lỗi lưu:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Các hàm fetch giữ nguyên
  const fetchRecords = useCallback(async (searchTerm = '') => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let query = supabase.from('records').select('id, patient_name, updated_at, status').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (searchTerm) query = query.ilike('patient_name', `%${searchTerm}%`);
      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) { return { success: false, data: [] }; } finally { setLoading(false); }
  }, []);

  const fetchRecord = useCallback(async (id) => {
    if (!id || id === 'new') return null;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('records').select('*').eq('id', id).single();
      if (error) throw error;
      return { ...data.form_data, id: data.id, created_at: data.created_at };
    } catch (error) { return null; } finally { setLoading(false); }
  }, []);
  
  const createRecord = (data) => saveRecord(data, null);
  const updateRecord = (id, data) => saveRecord(data, id);
  const deleteRecord = async (id) => { const { error } = await supabase.from('records').delete().eq('id', id); return { success: !error }; }

  return { loading, fetchRecords, fetchRecord, createRecord, updateRecord, saveRecord, deleteRecord };
};