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

export const roles = mysqlTable("roles", {
  id: bigint("id", {
    mode: "number",
  }).autoincrement().primaryKey(),

  name: varchar("name", {
    length: 100,
  })
    .notNull()
    .unique(),

  description: text("description"),

  createdAt: timestamp("created_at")
    .defaultNow(),
});