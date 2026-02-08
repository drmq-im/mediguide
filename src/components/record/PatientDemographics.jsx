import React from 'react';
import { useFormContext } from 'react-hook-form'; // <--- Hook lấy data từ cha
import { User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../ui/Card';
import Input from '../ui/Input';
import SectionLabel from '../ui/SectionLabel';
import ToggleGroup from '../ui/ToggleGroup';

const PatientDemographics = () => {
  const { t } = useLanguage();
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  return (
    <div id="sec-demo" className="scroll-mt-24">
      <Card title={t.demo} icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Input 
              label={t.name} 
              placeholder={t.ph_name} 
              {...register("demo.name")} 
              onChange={(e) => setValue("demo.name", e.target.value.toUpperCase())} 
              error={errors.demo?.name} 
              required 
            />
          </div>
          <div className="md:col-span-2">
            <Input 
              label={t.age} 
              type="number" 
              {...register("demo.age")} 
              error={errors.demo?.age} 
              required 
            />
          </div>
          <div className="md:col-span-2">
            <SectionLabel label={t.gender} required/>
            <ToggleGroup 
              options={['male', 'female']} 
              labels={[t.male, t.female]} 
              selected={watch('demo.gender')} 
              onChange={(v) => setValue('demo.gender', v, { shouldValidate: true })} 
            />
            {errors.demo?.gender && <p className="text-red-500 text-xs mt-1">{errors.demo.gender.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
          <Input label={t.room} placeholder="P.101" {...register("demo.room")}/>
          <Input label={t.bed} placeholder="G.01" {...register("demo.bed")}/>
          <div className="col-span-2"><Input label={t.occupation} {...register("demo.occupation")}/></div>
        </div>
      </Card>
    </div>
  );
};

export default PatientDemographics;