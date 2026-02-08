export const APP_CONFIG = {
  // Cấu hình Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ],

  // Cấu hình Phân trang & Tìm kiếm
  PAGINATION_SIZE: 9,
  SEARCH_DEBOUNCE_MS: 500,
  
  // Cấu hình UI
  TOAST_DURATION: 3000,
  
  // Thông tin ứng dụng
  APP_NAME: "MediGuide Pro",
  VERSION: "1.0.0"
};