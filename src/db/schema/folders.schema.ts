import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  bigint,
  uniqueIndex,
  index,
  type AnyMySqlColumn,
} from "drizzle-orm/mysql-core";
import { users } from "./users.schema";

export const folders = mysqlTable(
  "folders",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: bigint("user_id", {
      mode: "number",
    })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: int("parent_id").references((): AnyMySqlColumn => folders.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("folders_user_idx").on(table.userId),
    parentIdx: index("folders_parent_idx").on(table.parentId),
    folderNameUnique: uniqueIndex("folders_user_parent_name_unq").on(
      table.userId,
      table.parentId,
      table.name
    ),
  })
);
