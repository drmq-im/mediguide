import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import SectionLabel from '../ui/SectionLabel';
import ToggleGroup from '../ui/ToggleGroup';
import Input from '../ui/Input';
import DynamicList from '../features/DynamicList';

const ClinicalHistory = () => {
  const { t } = useLanguage();
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const allergyState = watch('history.allergy.hasAllergy');

  return (
    <div id="sec-history" className="scroll-mt-24">
      <Card title={t.history} icon={FileText}>
        <TextArea label={t.chiefComplaint} placeholder={t.ph_cc} {...register("history.chiefComplaint")} error={errors.history?.chiefComplaint} required />
        
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 mt-4">
            <TextArea label={t.hpi} placeholder={t.ph_hpi} rows={5} mic={true} {...register("history.hpi")} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="space-y-4">
                <TextArea label={t.pmh} placeholder={t.ph_pmh} {...register("history.pmh")} />
                <div className={cn("p-4 rounded-xl border transition-colors", allergyState ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200")}>
                    <div className="flex justify-between items-center mb-2">
                        <SectionLabel label={t.allergy} className={allergyState ? "text-red-700" : ""}/>
                        <ToggleGroup options={[true, false]} labels={[t.yes, t.no]} selected={allergyState} onChange={v => setValue('history.allergy.hasAllergy', v, { shouldValidate: true })} />
                    </div>
                    {allergyState && (
                        <Input placeholder={t.ph_allergy_detail} {...register("history.allergy.detail")} className="bg-white" error={errors.history?.allergy?.detail} />
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <SectionLabel label={t.meds} />
                <DynamicList items={watch('medications')} onChange={v => setValue('medications', v)} t={t} type="med" />
            </div>
        </div>
      </Card>
    </div>
  );
};

export default ClinicalHistory;