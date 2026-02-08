import React from 'react';
import { formatDate } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

const PrintTemplate = ({ data }) => {
  const { t } = useLanguage();

  if (!data) return null;

  // Lấy danh sách thuốc (Ưu tiên thuốc trong Kế hoạch điều trị, nếu không có lấy thuốc đang dùng)
  const medications = data.plan?.treatmentMeds?.length > 0 
    ? data.plan.treatmentMeds 
    : (data.medications || []);

  return (
    <div id="print-template" className="hidden print:block bg-white text-black p-8 max-w-[210mm] mx-auto font-serif leading-relaxed">
      
      {/* 1. HEADER - THÔNG TIN PHÒNG KHÁM */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div className="text-center">
            <h3 className="uppercase font-bold text-sm">Sở Y Tế TP.HCM</h3>
            <h2 className="uppercase font-black text-lg">MEDIGUIDE</h2>
            <p className="text-xs italic">ĐC: 123 Đường Nguyễn Văn Cừ, Q.5, TP.HCM</p>
            <p className="text-xs italic">SĐT:9999999999</p>
        </div>
        <div className="text-center">
            <h1 className="uppercase font-black text-2xl mb-1">ĐƠN THUỐC</h1>
            <p className="text-sm font-bold border border-black px-2 py-1 inline-block">Mã HS: {data.id?.slice(0, 8).toUpperCase() || '...........'}</p>
        </div>
      </div>

      {/* 2. HÀNH CHÍNH */}
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex gap-8">
            <p><span className="font-bold">Họ tên:</span> <span className="uppercase font-bold text-lg">{data.demo?.name}</span></p>
            <p><span className="font-bold">Tuổi:</span> {data.demo?.age}</p>
            <p><span className="font-bold">Giới tính:</span> {data.demo?.gender === 'male' ? 'Nam' : 'Nữ'}</p>
        </div>
        <div className="flex gap-8">
            <p><span className="font-bold">Địa chỉ/Phòng:</span> {data.demo?.room ? `P.${data.demo.room}` : '................................'}</p>
            <p><span className="font-bold">Nghề nghiệp:</span> {data.demo?.occupation || '....................'}</p>
        </div>
        {/* Chỉ hiện sinh hiệu nếu có nhập */}
        {data.exam?.vitals?.bp && (
            <div className="flex gap-4 border-t border-dashed border-gray-400 pt-2 mt-2 font-mono text-xs">
                <span>Mạch: {data.exam.vitals.pulse} l/p</span>
                <span>HA: {data.exam.vitals.bp} mmHg</span>
                <span>Nhiệt: {data.exam.vitals.temp}°C</span>
                <span>SpO2: {data.exam.vitals.spo2}%</span>
                <span>Cân nặng: {data.exam.vitals.weight || '...'} kg</span>
            </div>
        )}
      </div>

      {/* 3. CHẨN ĐOÁN */}
      <div className="mb-6 space-y-2">
        <div className="flex gap-2">
            <span className="font-bold min-w-[100px]">Chẩn đoán:</span>
            <div className="flex-1 border-b border-dotted border-gray-400">
                <span className="font-bold text-lg">{data.diagnosis?.final}</span>
                {data.diagnosis?.icd10 && <span className="ml-2 font-mono font-bold">({data.diagnosis.icd10})</span>}
            </div>
        </div>
        {data.diagnosis?.preliminary && (
            <div className="flex gap-2 text-sm">
                <span className="font-bold min-w-[100px]">Sơ bộ/Kèm theo:</span>
                <span className="flex-1 italic">{data.diagnosis.preliminary}</span>
            </div>
        )}
      </div>

      {/* 4. CHỈ ĐỊNH THUỐC (QUAN TRỌNG NHẤT) */}
      <div className="mb-6">
        <h3 className="font-bold border-b border-black mb-3 uppercase text-sm">Chỉ định điều trị</h3>
        
        {medications.length > 0 ? (
            <table className="w-full text-sm mb-4">
                <thead>
                    <tr className="border-b border-gray-300 text-left">
                        <th className="py-2 w-10">#</th>
                        <th className="py-2">Tên thuốc / Hàm lượng</th>
                        <th className="py-2 w-24">Số lượng</th>
                        <th className="py-2 w-48">Cách dùng</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {medications.map((med, idx) => (
                        <tr key={idx} className="align-top">
                            <td className="py-2 font-bold">{idx + 1}</td>
                            <td className="py-2">
                                <p className="font-bold text-base">{med.name}</p>
                                {/* Nếu có trường ghi chú thuốc thì hiện ở đây */}
                            </td>
                            <td className="py-2 font-bold text-lg">{med.quantity || '...'}</td>
                            <td className="py-2 italic">
                                {med.dose ? `Sáng ${med.dose.split('/')[0] || '-'}, Chiều ${med.dose.split('/')[1] || '-'}` : ''} 
                                <br/>
                                {med.route || 'Uống'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="italic text-gray-400 text-center py-4">-- Không có thuốc --</p>
        )}

        {/* Lời dặn */}
        <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm mt-4">
            <p><span className="font-bold underline">Lời dặn:</span> {data.plan?.notes || data.plan?.nonPharm || 'Tái khám khi hết thuốc.'}</p>
        </div>
      </div>

      {/* 5. FOOTER & KÝ TÊN */}
      <div className="flex justify-end mt-10">
        <div className="text-center min-w-[200px]">
            <p className="italic text-sm">Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            <p className="font-bold uppercase text-sm mt-1">Bác sĩ điều trị</p>
            <div className="h-24"></div> {/* Khoảng trống ký tên */}
            <p className="font-bold text-lg">{data.user_email ? `Bs. ${data.user_email.split('@')[0]}` : '.........................'}</p>
        </div>
      </div>

    </div>
  );
};

export default PrintTemplate;