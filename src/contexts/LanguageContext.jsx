import React, { createContext, useState, useContext, useEffect } from 'react';
import { TRANSLATIONS } from '../lib/constants';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Khởi tạo ngôn ngữ: Ưu tiên từ LocalStorage, mặc định là 'vi'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved === 'en' || saved === 'vi') ? saved : 'vi';
  });

  // Lưu lựa chọn vào LocalStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  // Lấy bộ từ điển tương ứng (Fallback về 'vi' nếu không tìm thấy key)
  const t = TRANSLATIONS[language] || TRANSLATIONS['vi'];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};