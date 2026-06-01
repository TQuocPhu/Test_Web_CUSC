import {
  mysqlTable,
  int,
  timestamp,
  json,
  bigint,
} from "drizzle-orm/mysql-core";
import { formSubmissions } from "./form_submissions.schema";
import { users } from "./users.schema";

export const submissionVersions = mysqlTable('submission_versions', {
  id: int('id').primaryKey().autoincrement(),
  submissionId: int('submission_id').references(() => formSubmissions.id, { onDelete: 'cascade' }).notNull(),
  versionNumber: int('version_number').notNull(), // Tăng dần: 1, 2, 3... cho mỗi lần backup nộp lại
  dataJson: json('data_json').notNull(), // Snapshot dữ liệu cũ tại phiên bản đó để đối chiếu lịch sử
  createdBy: bigint('created_by', { mode: 'number' }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});