import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  json,
  bigint,
} from "drizzle-orm/mysql-core";
import { formTemplates } from "./form_templates.schema";
import { templateVersions } from "./form_template_versions.schema";
import { users } from './users.schema';

export const formSubmissions = mysqlTable('form_submissions', {
  id: int('id').primaryKey().autoincrement(),
  submissionCode: varchar('submission_code', { length: 100 }).unique().notNull(), // Mã số phiếu (ví dụ: DXNP-2026-001)
  templateId: int('template_id').references(() => formTemplates.id).notNull(),
  templateVersionId: int('template_version_id').references(() => templateVersions.id).notNull(),
  submitterId: bigint('submitter_id', { mode: 'number' }).references(() => users.id).notNull(),
  status: varchar('status', { length: 50 }).default('DRAFT'), // DRAFT (Lưu nháp), PENDING, APPROVED, REJECTED
  workFlowStatus: varchar('work_flow_status', { length: 100 }), // Trạng thái luồng duyệt cụ thể
  currentStep: int('current_step').default(1), // Bước duyệt hiện tại trong quy trình
  dataJson: json('data_json'), // ✨ Nơi lưu toàn bộ câu trả lời, mảng dữ liệu nhiều dòng của User
  metaJson: json('meta_json'), // Lưu thông tin trình duyệt, IP, hoặc thông tin phụ trợ thiết bị
  qrVerifyToken: varchar('qr_verify_token', { length: 255 }), // Dùng để sinh QR xác thực trên đơn
  lastAutoSavedAt: timestamp('last_auto_saved_at'), // Đánh dấu mốc thời gian hệ thống tự động lưu nháp
  approvedAt: timestamp('approved_at'),
  rejectedAt: timestamp('rejected_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});