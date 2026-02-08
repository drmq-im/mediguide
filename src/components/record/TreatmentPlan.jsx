import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Pill } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';
import SectionLabel from '../ui/SectionLabel';
import ToggleGroup from '../ui/ToggleGroup';
import DynamicList from '../features/DynamicList';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';

const TreatmentPlan = () => {
  const { t } = useLanguage();
  const { register, watch, setValue } = useFormContext();
  const planStatus = watch('plan.status');

  return (
    <div id="sec-plan" className="scroll-mt-24">
      <Card title={t.plan} icon={Pill}>
        <div className="mb-6">
            <SectionLabel label={t.status}/> 
            <ToggleGroup options={['admitted', 'outpatient']} labels={[t.admitted, t.outpatient]} selected={planStatus} onChange={v => setValue('plan.status', v)} />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <SectionLabel label={t.meds} />
                <DynamicList items={watch('plan.treatmentMeds')} onChange={v => setValue('plan.treatmentMeds', v)} t={t} type="med" />
            </div>
            <div className="space-y-4">
                <TextArea label={t.treatmentGoal} placeholder={t.ph_note} {...register("plan.notes")} />
                <Input label={t.surgery} {...register("plan.surgery")} />
                <TextArea label={t.nonPharm} {...register("plan.nonPharm")} />
            </div>
        </div>
      </Card>
    </div>
  );
};

export default TreatmentPlan;