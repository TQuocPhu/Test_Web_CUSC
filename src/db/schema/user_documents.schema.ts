import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { folders } from "./folders.schema";
import { formSubmissions } from "./form_submissions.schema";

export const userDocuments = mysqlTable(
  "user_documents",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: bigint("user_id", {
      mode: "number",
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    folderId: int("folder_id").references(() => folders.id, {
      onDelete: "set null",
    }),
    submissionId: int("submission_id").references(() => formSubmissions.id, {
      onDelete: "set null",
    }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    filePath: varchar("file_path", { length: 500 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    fileSize: int("file_size"),
    status: varchar("status", { length: 50 }).default("ACTIVE"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("user_documents_user_idx").on(table.userId),
    folderIdx: index("user_documents_folder_idx").on(table.folderId),
    submissionIdx: index("user_documents_submission_idx").on(table.submissionId),
    statusIdx: index("user_documents_status_idx").on(table.status),
  })
);
