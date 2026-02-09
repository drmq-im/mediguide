import { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

export const useRecordManager = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  // --- 1. UPLOAD FILE (Sửa lại Path để khớp với RLS) ---
  const uploadFiles = async (filesMap) => {
    const uploadedUrls = {};
    
    // Lấy User ID hiện tại
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Chưa đăng nhập");

    for (const [category, files] of Object.entries(filesMap || {})) {
      if (!files || files.length === 0) continue;
      
      const processedFiles = await Promise.all(files.map(async (fileItem) => {
        // Nếu file đã có URL (file cũ), giữ nguyên
        if (fileItem.url && !fileItem.file) return fileItem;
        
        const actualFile = fileItem.file || fileItem; 
        if (!actualFile || !(actualFile instanceof File)) return fileItem;

        const fileExt = actualFile.name.split('.').pop();
        const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        const fileName = `${uniqueId}.${fileExt}`;
        
        // QUAN TRỌNG: Thêm user.id vào đường dẫn để khớp với Policy SQL
        const filePath = `${user.id}/${category}/${fileName}`;

        // Upload vào bucket 'medical-records'
        const { error: uploadError } = await supabase.storage
          .from('medical-records') 
          .upload(filePath, actualFile);

        if (uploadError) {
            console.error("Upload lỗi:", uploadError);
            return null;
        }

        // Với Private Bucket, ta lưu path để sau này dùng createSignedUrl
        return {
          name: actualFile.name,
          path: filePath, // Lưu path thay vì publicUrl
          type: actualFile.type
        };
      }));

      uploadedUrls[category] = processedFiles.filter(f => f !== null);
    }
    return uploadedUrls;
  };

  // --- 2. LƯU BỆNH ÁN (Dùng RPC để mã hóa) ---
  const saveRecord = async (data, recordId = null) => {
    setLoading(true);
    try {
      // 1. Upload file trước
      const uploadedFilesMap = await uploadFiles(data.files);
      
      // 2. Chuẩn bị dữ liệu JSON
      const recordData = {
        ...data,
        files: uploadedFilesMap // Cập nhật lại thông tin file đã upload
      };

      if (recordId && recordId !== 'new') {
        // --- LOGIC UPDATE (Tạm thời chưa dùng RPC Update mã hóa - demo dùng update thường) ---
        // Lưu ý: Nếu muốn bảo mật tuyệt đối, bạn cần viết thêm hàm RPC update_medical_record tương tự create
        const { error } = await supabase
            .from('records')
            .update({ 
                patient_name: data.demo.name,
                updated_at: new Date(),
                status: data.plan?.status === 'admitted' ? 'final' : 'draft',
                // Lưu ý: Update trực tiếp sẽ không mã hóa nếu không dùng RPC. 
                // Ở bước này tạm thời ta update vào cột form_data cũ để code chạy được.
                form_data: recordData 
            })
            .eq('id', recordId);
            
        if (error) throw error;
        return { success: true, id: recordId };

      } else {
        // --- LOGIC CREATE (Dùng RPC mã hóa) ---
        const { data: newId, error } = await supabase.rpc('create_medical_record', {
            p_patient_name: data.demo.name,
            p_content: recordData // Gửi JSON để mã hóa
        });

        if (error) throw error;
        return { success: true, id: newId };
      }
    } catch (error) {
      console.error("Lỗi lưu:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // --- 3. TẢI BỆNH ÁN (Dùng RPC để giải mã) ---
  const fetchRecord = useCallback(async (id) => {
    if (!id || id === 'new') return null;
    setLoading(true);
    try {
      // Gọi RPC giải mã
      const { data, error } = await supabase.rpc('get_medical_record', { p_record_id: id });

      if (error) throw error;
      const record = data?.[0]; // RPC trả về mảng

      if (!record) return null;

      // Trả về dữ liệu đã giải mã
      return { 
        ...record.content, // Spread JSON content ra form
        id: record.id, 
        created_at: record.updated_at,
        status: record.status
      };
    } catch (error) {
      console.error("Lỗi tải:", error);
      return null; 
    } finally { 
      setLoading(false); 
    }
  }, []);

  // --- 4. DANH SÁCH BỆNH ÁN (Dashboard) ---
  const fetchRecords = useCallback(async (searchTerm = '') => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('records')
        .select('id, patient_name, updated_at, status') // Chỉ lấy metadata, không lấy content mã hóa
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('patient_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createRecord = (data) => saveRecord(data, null);
  const updateRecord = (id, data) => saveRecord(id, data);
  
  const deleteRecord = async (id) => {
    try {
        const { error } = await supabase.from('records').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch(err) {
        return { success: false, message: err.message };
    }
  };

  return { 
    loading, 
    fetchRecords, 
    fetchRecord, 
    createRecord, 
    updateRecord, // Sửa lại tên biến export cho khớp
    saveRecord,
    deleteRecord 
  };
};