import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  bigint,
  decimal,
  index,
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema";
import { formTemplates } from "./form_templates.schema";

export const payments = mysqlTable(
  "payments",
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
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).default("PENDING"),
    transactionCode: varchar("transaction_code", { length: 100 }).unique(),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("payments_user_idx").on(table.userId),
    templateIdx: index("payments_template_idx").on(table.templateId),
    statusIdx: index("payments_status_idx").on(table.status),
    paidAtIdx: index("payments_paid_at_idx").on(table.paidAt),
  })
);
