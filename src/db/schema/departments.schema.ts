import {
  mysqlTable,
  varchar,
  timestamp,
  index,
  bigint,
  type AnyMySqlColumn,
} from "drizzle-orm/mysql-core";

export const departments = mysqlTable(
  "departments",
  {
    id: bigint("id", {
      mode: "number",
    }).autoincrement().primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    parentId: bigint("parent_id", {
      mode: "number",
    }).references((): AnyMySqlColumn => departments.id),

    createdAt: timestamp("created_at")
      .defaultNow(),
  },

  (table) => {
    return {
      parentIdx: index("departments_parent_idx")
        .on(table.parentId),
    };
  }
);