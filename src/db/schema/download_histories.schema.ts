import {
  mysqlTable,
  int,
  bigint,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { formTemplates } from "./form_templates.schema";

export const downloadHistories = mysqlTable(
  "download_histories",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: bigint("user_id", {
      mode: "number",
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    templateId: int("template_id")
      .notNull()
      .references(() => formTemplates.id, { onDelete: "cascade" }),
    downloadedAt: timestamp("downloaded_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("download_histories_user_idx").on(table.userId),
    templateIdx: index("download_histories_template_idx").on(table.templateId),
    downloadedAtIdx: index("download_histories_downloaded_at_idx").on(
      table.downloadedAt
    ),
  })
);
