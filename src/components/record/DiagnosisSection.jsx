import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Microscope, CheckCircle2, Sparkles, Activity, 
  Lightbulb, ChevronRight, ExternalLink 
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { WORKUP_CATEGORIES } from '../../lib/constants';

// UI Components
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';
import SectionLabel from '../ui/SectionLabel';
import FileUploader from '../features/FileUploader';
import ICD10Search from '../features/ICD10Search';
import GuidelineDetailModal from '../features/GuidelineDetailModal'; // Modal xem chi tiết

const DiagnosisSection = ({ onAiGenerate }) => {
  const { t } = useLanguage();
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  // --- LOGIC TÍCH HỢP GỢI Ý PHÁC ĐỒ ---
  const [guidelines, setGuidelines] = useState([]);
  const [selectedGuideline, setSelectedGuideline] = useState(null); // Để mở Modal
  const icd10Value = watch('diagnosis.icd10');

  useEffect(() => {
    const fetchGuidelines = async () => {
      if (!icd10Value) {
        setGuidelines([]);
        return;
      }

      try {
        // Lấy mã code (VD: "I10 - Tăng huyết áp" -> lấy "I10")
        const code = icd10Value.split(' - ')[0].trim();
        
        // Tìm trong bảng 'guidelines' xem có phác đồ nào chứa mã này không
        const { data, error } = await supabase
          .from('guidelines')
          .select('*')
          .contains('icd10_codes', [code]); // Cột icd10_codes là mảng text[]

        if (error) throw error;
        setGuidelines(data || []);
      } catch (err) {
        console.error("Lỗi tải Guideline:", err);
      }
    };

    fetchGuidelines();
  }, [icd10Value]);
  // -------------------------------------

  return (
    <>
      {/* 1. CLS & CHẨN ĐOÁN SƠ BỘ */}
      <div id="sec-prelim" className="scroll-mt-24">
        <Card title={t.prelim} icon={Microscope}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <TextArea label={t.prelim} {...register("diagnosis.preliminary")} />
              <Input label={t.diffDiag} {...register("diagnosis.differential")} className="mt-4" />
            </div>
            
            {/* Upload File Cận Lâm Sàng */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <SectionLabel label={t.workups} />
              <div className="mt-2 space-y-4">
                {WORKUP_CATEGORIES.map(({ id, label }) => (
                  <FileUploader 
                    key={id} 
                    label={label} 
                    files={watch(`files.${id}`) || []}
                    onUpload={(f) => setValue(`files.${id}`, [...(watch(`files.${id}`) || []), ...f], { shouldValidate: true })}
                    onDelete={(idx) => {
                      const current = watch(`files.${id}`) || [];
                      setValue(`files.${id}`, current.filter((_, i) => i !== idx));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. CHẨN ĐOÁN XÁC ĐỊNH & PHÁC ĐỒ */}
      <div id="sec-final" className="scroll-mt-24 mt-8">
        <Card title={t.final} icon={CheckCircle2}>
          {/* Tóm tắt bệnh án & AI Button */}
          <div className="relative">
            <TextArea label={t.summary} rows={3} mic={true} {...register("diagnosis.summary")} />
            <button 
              type="button" 
              onClick={onAiGenerate} 
              className="absolute top-0 right-0 mt-[-2px] text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition"
            >
              <Sparkles size={14}/> {t.aiGen}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start mt-4">
            {/* Chẩn đoán Text */}
            <div className="md:col-span-2">
              <Input 
                label={t.finalDiag} 
                {...register("diagnosis.final")} 
                error={errors.diagnosis?.final} 
                required 
              />
            </div>
            
            {/* Tìm kiếm ICD-10 */}
            <div>
                <ICD10Search 
                value={watch('diagnosis.icd10')} 
                onChange={v => setValue('diagnosis.icd10', v, { shouldValidate: true })} 
                error={errors.diagnosis?.icd10}
                />
            </div>
          </div>

          {/* --- KHUNG GỢI Ý PHÁC ĐỒ (HIỆN NẾU TÌM THẤY) --- */}
          {guidelines.length > 0 && (
            <div className="mt-6 animate-in slide-in-from-top-2 fade-in">
                <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={18} className="text-amber-500 fill-amber-500"/>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Gợi ý điều trị liên quan
                    </span>
                </div>
                
                <div className="grid gap-3">
                    {guidelines.map(gl => (
                        <div 
                            key={gl.id} 
                            onClick={() => setSelectedGuideline(gl)}
                            className="group bg-amber-50/50 border border-amber-200 p-4 rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer relative overflow-hidden"
                        >
                            {/* Dải màu trang trí bên trái */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>

                            <div className="flex justify-between items-start pl-2">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        {gl.title || gl.disease_name}
                                        <span className="text-[10px] bg-white border border-amber-200 px-2 py-0.5 rounded-full text-amber-700 font-normal">
                                            {gl.source_name}
                                        </span>
                                    </h4>
                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {gl.quick_summary}
                                    </p>
                                </div>
                                <div className="p-2 bg-white rounded-lg text-slate-300 group-hover:text-blue-600 shadow-sm">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                            
                            <div className="mt-2 pl-2 flex items-center gap-1 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                Xem chi tiết phác đồ <ExternalLink size={10}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modal hiển thị chi tiết phác đồ */}
      <GuidelineDetailModal 
        isOpen={!!selectedGuideline} 
        onClose={() => setSelectedGuideline(null)} 
        guideline={selectedGuideline} 
      />
    </>
  );
};

export default DiagnosisSection;