import { z } from "zod";

export const ElementStyleSchema = z.object({
  x: z.number({ message: "Tọa độ X không được để trống" }).nonnegative("Tọa độ X không được âm"),
  y: z.number({ message: "Tọa độ Y không được để trống" }).nonnegative("Tọa độ Y không được âm"),
  width: z.number({ message: "Chiều rộng không được để trống" }).positive("Chiều rộng phần tử phải lớn hơn 0"),
  height: z.number({ message: "Chiều cao không được để trống" }).positive("Chiều cao phần tử phải lớn hơn 0"),
  fontSize: z.number().positive("Cỡ chữ phải lớn hơn 0").optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Mã màu Hex không hợp lệ").optional(),
});

export const DynamicTableColumnSchema = z.object({
  key: z.string({ message: "Mã cột không được để trống" }).min(1, "Mã cột không được để trống"),
  label: z.string({ message: "Tên hiển thị cột không được để trống" }).min(1, "Tên hiển thị cột không được để trống"),
  type: z.string({ message: "Kiểu dữ liệu cột không được để trống" }),
});

export const FormElementSchema = z.object({
  id: z.string({ message: "ID phần tử không được để trống" }).min(1),
  type: z.string({ message: "Loại phần tử (Input, Select...) không được để trống" }),
  fieldKey: z
    .string({ message: "Mã định danh trường dữ liệu (fieldKey) không được để trống" })
    .min(1, "fieldKey không được để trống")
    .regex(/^[a-zA-Z0-9_]+$/, "fieldKey chỉ được chứa chữ cái, số và dấu gạch dưới"),
  label: z.string({ message: "Nhãn hiển thị phần tử không được để trống" }).min(1, "Nhãn hiển thị không được để trống"),
  required: z.boolean().default(false),
  style: ElementStyleSchema,
  columns: z.array(DynamicTableColumnSchema).optional(),
});

export const TemplatePageSchema = z.object({
  id: z.string({ message: "ID trang không được để trống" }),
  name: z.string().min(1, "Tên trang không được để trống"),
  width: z.number().positive("Chiều rộng trang phải lớn hơn 0"),
  height: z.number().positive("Chiều cao trang phải lớn hơn 0"),
  background: z.string().default("#ffffff"),
  elements: z.array(FormElementSchema, { message: "Danh sách phần tử giao diện không được để trống" }),
});

export const TemplateThemeSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Mã màu chủ đạo không hợp lệ"),
  fontFamily: z.string().default("Inter"),
});

export const TemplateSettingSchema = z.object({
  allowExportPdf: z.boolean().default(true),

  allowSignature: z.boolean().default(true),

  allowQrVerify: z.boolean().default(true),

  autoSave: z.boolean().default(true),
});

export const VisualSchemaJson = z.object({
  pages: z.array(TemplatePageSchema).min(1, "Biểu mẫu phải có ít nhất 1 trang"),

  theme: TemplateThemeSchema.optional(),

  settings: TemplateSettingSchema.optional(),
});