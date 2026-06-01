import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  bigint,
} from "drizzle-orm/mysql-core";

export const formCategories = mysqlTable(
  "form_categories",
  {
    id: bigint("id", {
      mode: "number",
    }).autoincrement().primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    slug: varchar("slug", {
      length: 255,
    }).notNull().unique(),

    icon: varchar("icon", {
      length: 255,
    }),

    color: varchar("color", {
      length: 50,
    }),

    parentId: bigint("parent_id", {
      mode: "number",
    }),

    sortOrder: int("sort_order")
      .default(0),

    createdAt: timestamp("created_at")
      .defaultNow(),
  }
);