// Danh sách các danh mục cận lâm sàng
export const WORKUP_CATEGORIES = [
  { id: 'hemo_bio', label: 'Huyết học & Sinh hóa' },
  { id: 'imaging', label: 'Chẩn đoán hình ảnh (X-Quang, CT...)' },
  { id: 'microbio', label: 'Vi sinh & Ký sinh trùng' },
  { id: 'functional', label: 'Thăm dò chức năng (ECG, EEG)' },
  { id: 'pathology', label: 'Giải phẫu bệnh' },
  { id: 'others', label: 'Khác' },
];

export const TRANSLATIONS = {
  vi: {
    // --- APP CORE ---
    appTitle: "MediGuide Pro",
    dashboard: "Tổng quan",
    newRecord: "Hồ sơ mới",
    
    // --- AUTH (PHẦN MỚI THÊM) ---
    email: "Email",
    password: "Mật khẩu",
    ph_email: "bacsi@example.com",
    ph_password: "••••••••",
    signIn: "Đăng nhập",
    signUp: "Đăng ký tài khoản",
    or: "HOẶC",
    forgotPass: "Quên mật khẩu?",
    haveAccount: "Đã có tài khoản?",
    noAccount: "Chưa có tài khoản?",
    toggleLogin: "Đăng nhập ngay",
    toggleSignup: "Đăng ký ngay",
    loggingIn: "Đang xử lý...",
    signingUp: "Đang tạo tài khoản...",
    auth_err: "Lỗi xác thực",
    welcome_back: "Chào mừng trở lại!",
    create_account: "Tạo tài khoản mới",

    // --- SECTIONS ---
    demo: "Hành chính",
    history: "Bệnh sử",
    exam: "Khám Lâm Sàng",
    prelim: "Cận lâm sàng",
    final: "Chẩn đoán",
    plan: "Điều trị",

    // --- DEMOGRAPHICS ---
    name: "Họ và tên",
    ph_name: "NHẬP TÊN BỆNH NHÂN...",
    age: "Tuổi",
    gender: "Giới tính",
    male: "Nam",
    female: "Nữ",
    room: "Phòng",
    bed: "Giường",
    occupation: "Nghề nghiệp",

    // --- HISTORY ---
    chiefComplaint: "Lý do vào viện",
    ph_cc: "Triệu chứng chính...",
    hpi: "Quá trình bệnh lý",
    ph_hpi: "Mô tả diễn biến...",
    pmh: "Tiền sử bản thân/Gia đình",
    ph_pmh: "Bệnh mãn tính, phẫu thuật cũ...",
    allergy: "Dị ứng",
    yes: "Có",
    no: "Không",
    ph_allergy_detail: "Tên thuốc/thức ăn...",
    meds: "Thuốc đang dùng",

    // --- EXAM ---
    vitals: "Sinh hiệu",
    pulse: "Mạch",
    bp: "Huyết áp",
    rr: "Nhịp thở",
    spo2: "SpO2",
    temp: "Nhiệt độ",
    weight: "Cân nặng",
    
    general: "Toàn thân",
    heent: "Đầu - Mặt - Cổ",
    cvs: "Tim mạch",
    resp: "Hô hấp",
    gi: "Tiêu hóa",
    msk: "Cơ xương khớp",
    neuro: "Thần kinh",
    gu: "Thận - Tiết niệu",

    ph_general: "Da niêm, hạch ngoại vi...",
    ph_heent: "Kết mạc, họng, tuyến giáp...",
    ph_cvs: "Tiếng tim, mỏm tim...",
    ph_resp: "Rì rào phế nang...",
    ph_gi: "Bụng mềm, gan lách...",
    ph_msk: "Vận động khớp...",
    ph_neuro: "Glasgow, dấu thần kinh...",
    ph_gu: "Cầu bàng quang...",

    // --- DIAGNOSIS ---
    diffDiag: "Chẩn đoán phân biệt",
    workups: "Cận lâm sàng đã có",
    summary: "Tóm tắt bệnh án",
    aiGen: "AI Tóm tắt",
    finalDiag: "Chẩn đoán xác định",
    icd10: "Mã ICD-10",
    ph_icd: "Tìm mã bệnh...",

    // --- PLAN & THUỐC ---
    status: "Hướng xử trí",
    admitted: "Nhập viện",
    outpatient: "Ngoại trú",
    treatmentGoal: "Mục tiêu / Lời dặn",
    ph_note: "Chế độ ăn, hẹn tái khám...",
    surgery: "Thủ thuật / Phẫu thuật",
    nonPharm: "Không dùng thuốc",
    
    // Labels cho DynamicList
    med_name: "Tên thuốc & Hàm lượng",
    med_dose: "Liều lượng (Sáng - Chiều)",
    med_route: "Đường dùng",
    ph_med_name: "VD: Panadol 500mg...",
    ph_med_dose: "VD: 1 viên - 0 - 1 viên",
    ph_med_route: "VD: Uống sau ăn",
    add_med: "Thêm thuốc",
    
    mon_name: "Chỉ số theo dõi",
    mon_freq: "Tần suất",
    ph_mon_name: "VD: Mạch, Huyết áp...",
    ph_mon_freq: "VD: Mỗi 4 giờ",
    add_mon: "Thêm chỉ số",

    // --- BUTTONS ---
    saveDraft: "Lưu nháp",
    submit: "Hoàn tất",
    upload: "Tải file",
    uploading: "Đang tải...",
    file_size_err: "File quá lớn",
    save_success: "Lưu thành công!",
  },

  // ---------------------------------------------------------
  // PHẦN TIẾNG ANH (ĐẦY ĐỦ)
  // ---------------------------------------------------------
  en: {
    // --- APP CORE ---
    appTitle: "MediGuide Pro",
    dashboard: "Dashboard",
    newRecord: "New Record",
    
    // --- AUTH ---
    email: "Email",
    password: "Password",
    ph_email: "doctor@example.com",
    ph_password: "••••••••",
    signIn: "Sign In",
    signUp: "Create Account",
    or: "OR",
    forgotPass: "Forgot Password?",
    haveAccount: "Already have an account?",
    noAccount: "No account yet?",
    toggleLogin: "Sign In Now",
    toggleSignup: "Sign Up Now",
    loggingIn: "Processing...",
    signingUp: "Creating account...",
    auth_err: "Authentication Error",
    welcome_back: "Welcome Back!",
    create_account: "Create New Account",

    // --- SECTIONS ---
    demo: "Demographics",
    history: "History",
    exam: "Physical Exam",
    prelim: "Labs & Prelim Diag",
    final: "Diagnosis",
    plan: "Treatment Plan",

    // --- DEMOGRAPHICS ---
    name: "Full Name",
    ph_name: "ENTER PATIENT NAME...",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    room: "Room",
    bed: "Bed",
    occupation: "Occupation",

    // --- HISTORY ---
    chiefComplaint: "Chief Complaint",
    ph_cc: "Main symptoms...",
    hpi: "History of Present Illness",
    ph_hpi: "Describe the progression...",
    pmh: "Past Medical History",
    ph_pmh: "Chronic diseases, surgeries...",
    allergy: "Allergies",
    yes: "Yes",
    no: "No",
    ph_allergy_detail: "Drug/Food name...",
    meds: "Current Medications",

    // --- EXAM ---
    vitals: "Vitals",
    pulse: "Pulse",
    bp: "BP",
    rr: "Resp. Rate",
    spo2: "SpO2",
    temp: "Temp",
    weight: "Weight",
    
    general: "General",
    heent: "HEENT",
    cvs: "Cardiovascular",
    resp: "Respiratory",
    gi: "Gastrointestinal",
    msk: "Musculoskeletal",
    neuro: "Neurological",
    gu: "Genitourinary",

    ph_general: "Skin, lymph nodes, edema...",
    ph_heent: "Conjunctiva, throat, thyroid...",
    ph_cvs: "Heart sounds, murmurs...",
    ph_resp: "Breath sounds, rales...",
    ph_gi: "Soft, liver/spleen...",
    ph_msk: "Joint movement...",
    ph_neuro: "Glasgow, focal signs...",
    ph_gu: "Bladder globe...",

    // --- DIAGNOSIS ---
    diffDiag: "Differential Diagnosis",
    workups: "Workups / Labs",
    summary: "Summary",
    aiGen: "AI Summary",
    finalDiag: "Final Diagnosis",
    icd10: "ICD-10 Code",
    ph_icd: "Search code...",

    // --- PLAN & MEDS ---
    status: "Disposition",
    admitted: "Admit",
    outpatient: "Discharge",
    treatmentGoal: "Goals / Notes",
    ph_note: "Diet, follow-up...",
    surgery: "Procedure / Surgery",
    nonPharm: "Non-pharmaceutical",
    
    // Labels for DynamicList
    med_name: "Drug Name & Strength",
    med_dose: "Dosage (AM - PM)",
    med_route: "Route",
    ph_med_name: "Ex: Panadol 500mg...",
    ph_med_dose: "Ex: 1 tab - 0 - 1 tab",
    ph_med_route: "Ex: PO after meal",
    add_med: "Add Medication",
    
    mon_name: "Monitoring",
    mon_freq: "Frequency",
    ph_mon_name: "Ex: HR, BP...",
    ph_mon_freq: "Ex: Every 4 hours",
    add_mon: "Add Item",

    // --- BUTTONS ---
    saveDraft: "Save Draft",
    submit: "Submit",
    upload: "Upload",
    uploading: "Uploading...",
    file_size_err: "File too large",
    save_success: "Saved successfully!",
  }
};