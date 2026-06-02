import {
  mysqlTable,
  int,
  bigint,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { formTemplates } from "./form_templates.schema";

export const favourites = mysqlTable(
  "favourites",
  {
    userId: bigint("user_id", {
      mode: "number",
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    templateId: int("template_id")
      .notNull()
      .references(() => formTemplates.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.templateId],
    }),
    templateIdx: index("favourites_template_idx").on(table.templateId),
  })
);
