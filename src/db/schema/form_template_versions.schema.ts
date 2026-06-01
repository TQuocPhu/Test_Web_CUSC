import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  json,
  bigint,
} from "drizzle-orm/mysql-core";
import { formTemplates } from "./form_templates.schema";
import { users } from "./users.schema";

export const templateVersions = mysqlTable('template_versions', {
  id: int('id').primaryKey().autoincrement(),
  templateId: int('template_id').references(() => formTemplates.id, { onDelete: 'cascade' }).notNull(),
  version: varchar('version', { length: 50 }).notNull(), // Ví dụ: "1.0.0"
  schemaJson: json('schema_json').notNull(), // Lưu cấu hình layout kéo thả giống cục JSON ông viết lúc nãy
  htmlContent: text('html_content'), // Nội dung HTML render tĩnh (nếu cần)
  cssContent: text('css_content'), // Style CSS tùy biến riêng cho form
  description: text('description'),
  instructions: text('instructions'), // Hướng dẫn sử dụng biểu mẫu
  requiredDocuments: text('required_documents'), // Thành phần hồ sơ cần kèm theo
  changeLogs: text('change_logs'), // Nhật ký cập nhật của phiên bản này
  effectiveDate: timestamp('effective_date'), // Ngày bắt đầu có hiệu lực
  isPublished: int('is_published').default(0), // 0: Nháp, 1: Đã xuất bản công khai
  updatedBy: bigint('updated_by', { mode: 'number' }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});