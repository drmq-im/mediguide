import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Stethoscope, Activity, Thermometer, Wind, HeartPulse, Scale, Ruler } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import Card from '../ui/Card';
import SymptomTagger from '../features/SymptomTagger';
import TextArea from '../ui/TextArea';

const PhysicalExam = () => {
  const { t } = useLanguage();
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  // Cấu hình danh sách sinh hiệu (Kèm Icon và Đơn vị)
  const vitalsConfig = [
    { key: 'pulse', label: t.pulse, unit: 'lần/p', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50' },
    { key: 'bp', label: t.bp, unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { key: 'temp', label: t.temp, unit: '°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
    { key: 'rr', label: t.rr, unit: 'lần/p', icon: Wind, color: 'text-green-500', bg: 'bg-green-50' },
    { key: 'spo2', label: t.spo2, unit: '%', icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { key: 'weight', label: t.weight, unit: 'kg', icon: Scale, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  // Cấu hình các cơ quan (Chia nhóm)
  const organSystems = [
    { key: 'general', label: t.general, ph: t.ph_general },
    { key: 'heent', label: t.heent, ph: t.ph_heent },
    { key: 'cvs', label: t.cvs, ph: t.ph_cvs },
    { key: 'resp', label: t.resp, ph: t.ph_resp },
    { key: 'gi', label: t.gi, ph: t.ph_gi },
    { key: 'msk', label: t.msk, ph: t.ph_msk },
    { key: 'neuro', label: t.neuro, ph: t.ph_neuro },
    { key: 'gu', label: t.gu, ph: t.ph_gu },
  ];

  return (
    <div id="sec-exam" className="scroll-mt-24 space-y-6">
      <Card title={t.exam} icon={Stethoscope} accentColor="blue">
        
        {/* 1. TAGS TRIỆU CHỨNG NHANH */}
        <div className="mb-6">
             <SymptomTagger tags={watch('symptoms')} onChange={v => setValue('symptoms', v)} />
        </div>

        {/* 2. SINH HIỆU (VITALS DASHBOARD) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{t.vitals}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {vitalsConfig.map((v) => (
                    <div key={v.key} className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm flex flex-col items-center text-center relative focus-within:ring-2 ring-blue-500/20 transition-all">
                        <div className={cn("mb-1 p-1.5 rounded-full", v.bg, v.color)}>
                            <v.icon size={14} />
                        </div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">{v.label}</label>
                        <div className="relative w-full">
                            <input 
                                {...register(`exam.vitals.${v.key}`)}
                                className="w-full text-center font-bold text-lg text-slate-900 outline-none bg-transparent p-0 placeholder:text-slate-200"
                                placeholder="--"
                                autoComplete="off"
                            />
                            {errors.exam?.vitals?.[v.key] && (
                                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500"></div>
                            )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">{v.unit}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* 3. KHÁM BỘ PHẬN (GRID LAYOUT) */}
        <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Khám chuyên khoa</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {organSystems.map((sys) => (
                    <div key={sys.key} className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                            {sys.label}
                        </label>
                        <textarea
                            {...register(`exam.${sys.key}`)}
                            rows={3}
                            className="w-full bg-slate-50 group-hover:bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                            placeholder={sys.ph || "Mô tả..."}
                        />
                    </div>
                ))}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default PhysicalExam;