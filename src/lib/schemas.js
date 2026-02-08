import { z } from "zod";

// Định nghĩa các thông báo lỗi tiếng Việt
const REQUIRED_MSG = "Trường này là bắt buộc";
const NUMBER_MSG = "Phải là số hợp lệ";

// 1. Schema cho thuốc (Dùng trong danh sách động)
const medicationSchema = z.object({
  name: z.string().min(1, "Tên thuốc không được trống"),
  dose: z.string().optional(),
  route: z.string().optional(), // Đường dùng (Uống/Tiêm)
});

// 2. Schema cho File đính kèm (Cận lâm sàng)
// Lưu ý: File upload trả về object, ta cần validate cấu trúc đó
const fileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  type: z.string().optional(),
});

// 3. Schema Chính: BỆNH ÁN (Medical Record)
export const recordSchema = z.object({
  // --- A. HÀNH CHÍNH ---
  demo: z.object({
    name: z
      .string()
      .min(2, "Tên quá ngắn")
      .transform((val) => val.toUpperCase()), // Tự động viết hoa
    age: z.coerce
      .number({ invalid_type_error: NUMBER_MSG })
      .min(0, "Tuổi không được âm")
      .max(130, "Tuổi không hợp lệ (>130)"),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Vui lòng chọn giới tính" }),
    }),
    room: z.string().optional(),
    bed: z.string().optional(),
    occupation: z.string().optional(),
  }),

  // --- B. BỆNH SỬ & TIỀN SỬ ---
  history: z.object({
    chiefComplaint: z.string().min(3, REQUIRED_MSG), // Lý do vào viện
    hpi: z.string().optional(), // Bệnh sử
    pmh: z.string().optional(), // Tiền sử
    allergy: z.object({
      hasAllergy: z.boolean().default(false),
      detail: z.string().optional(),
    }).refine((data) => !data.hasAllergy || (data.hasAllergy && data.detail?.length > 0), {
      message: "Vui lòng nhập tên dị nguyên",
      path: ["detail"], // Chỉ báo lỗi vào ô detail
    }),
  }),

  // --- C. KHÁM LÂM SÀNG (Validation chặt chẽ) ---
  exam: z.object({
    vitals: z.object({
      pulse: z.coerce.number().min(0).max(300).or(z.literal("")).optional(), // Mạch
      bp: z.string().regex(/^\d{2,3}\/\d{2,3}$/, "Định dạng sai (VD: 120/80)").or(z.literal("")).optional(), // HA
      rr: z.coerce.number().min(0).max(100).or(z.literal("")).optional(), // Nhịp thở
      spo2: z.coerce.number().min(0).max(100, "SpO2 tối đa 100%").or(z.literal("")).optional(),
      temp: z.coerce.number().min(30).max(45, "Nhiệt độ không hợp lý").or(z.literal("")).optional(),
    }),
    general: z.string().optional(),
    heent: z.string().optional(),
    cvs: z.string().optional(),
    resp: z.string().optional(),
    gi: z.string().optional(),
    msk: z.string().optional(),
    neuro: z.string().optional(),
    gu: z.string().optional(),
  }),

  // --- D. CHẨN ĐOÁN ---
  diagnosis: z.object({
    preliminary: z.string().optional(),
    differential: z.string().optional(),
    summary: z.string().optional(),
    final: z.string().min(1, "Chẩn đoán xác định là bắt buộc"),
    icd10: z.string().min(1, "Cần chọn mã ICD-10"), // Bắt buộc
  }),

  // --- E. CẬN LÂM SÀNG (Files) ---
  // Object với key là string, value là mảng fileSchema
  files: z.record(z.array(fileSchema)).optional(),
  
  // --- F. ĐIỀU TRỊ ---
  plan: z.object({
    status: z.enum(["admitted", "outpatient"]),
    goals: z.array(z.string()).optional(),
    treatmentMeds: z.array(medicationSchema).optional(),
    surgery: z.string().optional(),
    nonPharm: z.string().optional(),
    notes: z.string().optional(),
  }),

  // Các danh sách khác
  medications: z.array(medicationSchema).optional(), // Thuốc đang dùng
  symptoms: z.array(z.string()).optional(),
});