import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 1. Merge Tailwind Classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 2. Định dạng ngày tháng (Hỗ trợ đa ngôn ngữ)
export const formatDate = (dateString, lang = 'vi') => {
  if (!dateString) return '';
  
  const locales = {
    'vi': 'vi-VN',
    'en': 'en-US'
  };

  return new Date(dateString).toLocaleDateString(locales[lang] || 'vi-VN', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
};

// 3. Hàm tạo delay (Dùng khi test loading)
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
