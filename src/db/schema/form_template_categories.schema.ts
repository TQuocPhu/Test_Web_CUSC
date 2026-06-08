import {
  mysqlTable,
  int,
  bigint,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/mysql-core";
import { formTemplates } from "./form_templates.schema";
import { formCategories } from "./form_categories.schema";

export const formTemplateCategories = mysqlTable(
  "form_template_categories",
  {
    templateId: int("template_id")
      .notNull()
      .references(() => formTemplates.id, { onDelete: "cascade" }),
    categoryId: bigint("category_id", {
      mode: "number",
    })
      .notNull()
      .references(() => formCategories.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.templateId, table.categoryId],
    }),
    templateIdx: index("ftc_template_idx").on(table.templateId),
    categoryIdx: index("ftc_category_idx").on(table.categoryId),
  })
);
