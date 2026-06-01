import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  json,
  mysqlEnum,
  primaryKey,
  uniqueIndex,
  index,
  bigint,
} from "drizzle-orm/mysql-core";

export const permissions = mysqlTable(
  "permissions",
  {
    id: bigint("id", {
      mode: "number",
    }).autoincrement().primaryKey(),

    code: varchar("code", {
      length: 255,
    }).notNull(),

    description: text("description"),

    createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  }
);