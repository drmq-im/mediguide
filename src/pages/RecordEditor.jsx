import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { recordSchema } from '../lib/schemas';
import { 
  Save, Activity, Printer, Loader2, Sparkles 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecordManager } from '../hooks/useRecordManager';

// Import Components
import PatientDemographics from '../components/record/PatientDemographics';
import ClinicalHistory from '../components/record/ClinicalHistory';
import PhysicalExam from '../components/record/PhysicalExam';
import DiagnosisSection from '../components/record/DiagnosisSection';
import TreatmentPlan from '../components/record/TreatmentPlan';
import PrintTemplate from '../components/record/PrintTemplate';
import MedicalLibraryModal from '../components/features/MedicalLibraryModal';
import TableOfContents from '../components/features/TableOfContents';
import Toast from '../components/ui/Toast';

const RecordEditor = ({ session }) => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Hook quản lý dữ liệu (đã sửa ở bước trước)
  const { saveRecord, fetchRecord, loading: apiLoading } = useRecordManager();

  const [toast, setToast] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [medicalData, setMedicalData] = useState([]); // Dữ liệu thư viện

  // Setup Form
  const methods = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      demo: { gender: 'male' },
      medications: [],
      files: { hemo_bio: [], imaging: [] },
      plan: { treatmentMeds: [] }
    }
  });

  const { reset, handleSubmit, watch, setValue } = methods;

  // --- 1. LOAD HỒ SƠ (FIX LỖI UI TẠI ĐÂY) ---
  useEffect(() => {
    const loadRecord = async () => {
      // Chỉ fetch nếu có ID và không phải trang tạo mới
      if (id && id !== 'new') {
        const data = await fetchRecord(id);
        
        if (data) {
          // Trường hợp 1: Tìm thấy hồ sơ -> Đổ dữ liệu vào form
          reset(data);
        } else {
          // Trường hợp 2: Lỗi hoặc Không tìm thấy (data là null)
          setToast({ 
            message: "Không tìm thấy hồ sơ hoặc bạn không có quyền truy cập!", 
            type: "error" 
          });
          
          // Tự động quay về trang chủ sau 2 giây để tránh lỗi UI
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    };
    loadRecord();
  }, [id, fetchRecord, reset, navigate]);

  // --- 2. LOAD THƯ VIỆN KIẾN THỨC ---
  useEffect(() => {
    const loadLibrary = async () => {
      // Gọi vào bảng medical_knowledge
      const { data, error } = await supabase
        .from('medical_knowledge') 
        .select('*');
      
      if (error) console.error("Lỗi tải thư viện:", error);
      else setMedicalData(data || []);
    };
    loadLibrary();
  }, []);

  // --- XỬ LÝ LƯU ---
  const onSubmit = async (data) => {
    const res = await saveRecord(data, id);
    if (res.success) {
      setToast({ message: res.message, type: 'success' });
      // Nếu là tạo mới thành công -> chuyển hướng sang URL có ID
      if (id === 'new') navigate(`/record/${res.id}`);
    } else {
      setToast({ message: res.message, type: 'error' });
    }
  };

  // --- XỬ LÝ CHỌN BỆNH TỪ THƯ VIỆN ---
  const handleLibrarySelect = (item) => {
    // Tự động điền chẩn đoán sơ bộ nếu có
    if (item.preliminary_diagnosis) {
        setValue('diagnosis.preliminary', item.preliminary_diagnosis, { shouldDirty: true });
    }
    // Tự động điền hướng điều trị vào lời dặn (ví dụ)
    if (item.treatment_steps && item.treatment_steps.length > 0) {
        const currentNotes = watch('plan.notes') || '';
        const suggestion = `\n[Tham khảo ${item.title}]:\n- ` + item.treatment_steps.join('\n- ');
        setValue('plan.notes', currentNotes + suggestion, { shouldDirty: true });
    }
    setShowLibrary(false);
    setToast({ message: `Đã áp dụng kiến thức: ${item.title}`, type: 'success' });
  };

  // --- XỬ LÝ AI GENERATE (Placeholder) ---
  const handleAIGenerate = () => {
    setToast({ message: "Tính năng AI đang được phát triển...", type: "info" });
  };

  // --- MÀN HÌNH LOADING (Tránh crash khi chưa có data) ---
  if (apiLoading && !methods.formState.isDirty) {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
            <Loader2 className="animate-spin text-blue-600" size={40}/>
            <p className="text-slate-400 font-bold text-sm animate-pulse">Đang tải dữ liệu hồ sơ...</p>
        </div>
    );
  }

  const SECTIONS = [
    { id: 'sec-demo', label: t.demo },
    { id: 'sec-history', label: t.history },
    { id: 'sec-exam', label: t.exam },
    { id: 'sec-prelim', label: t.prelim },
    { id: 'sec-final', label: t.final },
    { id: 'sec-plan', label: t.plan },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 p-4 md:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-30 py-4 px-2 border-b border-slate-200/50">
        <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                {id === 'new' ? t.newRecord : "Chỉnh sửa hồ sơ"}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
                {id !== 'new' ? `ID: ${id}` : 'Tạo hồ sơ khám bệnh mới'}
            </p>
        </div>
        
        <div className="flex gap-3">
            <button onClick={() => window.print()} className="p-3 bg-white text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-200 shadow-sm print:hidden transition-colors" title="In hồ sơ">
                <Printer size={20}/>
            </button>
            <button 
                onClick={handleSubmit(onSubmit)} 
                disabled={apiLoading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {apiLoading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
                <span>{t.save}</span>
            </button>
        </div>
      </div>

      <FormProvider {...methods}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cột chính nhập liệu */}
            <div className="lg:col-span-9 space-y-8">
                <PatientDemographics />
                <ClinicalHistory />
                <PhysicalExam />
                {/* Truyền hàm AI Generate xuống */}
                <DiagnosisSection onAiGenerate={handleAIGenerate} />
                <TreatmentPlan />
            </div>
            
            {/* Cột mục lục bên phải (Ẩn trên mobile) */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24">
                <TableOfContents sections={SECTIONS} />
            </div>
        </div>
      </FormProvider>

      {/* Hidden Print Template (Chỉ hiện khi in) */}
      <PrintTemplate data={{...watch(), id: id || 'new', user_email: session?.user?.email}} />

      {/* Library Modal */}
      <MedicalLibraryModal 
        isOpen={showLibrary} 
        onClose={() => setShowLibrary(false)} 
        medicalData={medicalData} 
        onSelect={handleLibrarySelect} 
      />
      
      {/* Floating Action Button: Mở thư viện */}
      <button 
        onClick={() => setShowLibrary(true)} 
        className="fixed bottom-6 left-6 z-40 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 hover:scale-110 transition-transform print:hidden group" 
        title="Thư viện Y khoa"
      >
        <Activity size={24} className="group-hover:animate-pulse"/>
      </button>
    </div>
  );
};

export default RecordEditor;