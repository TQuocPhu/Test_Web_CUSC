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
import { departments } from "./departments.schema";

export const users = mysqlTable("users" , {
    id: bigint("id", {
        mode: "number",
    }).autoincrement().primaryKey(),

    email: varchar("email", {
    length: 255,
  }).notNull().unique(),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  fullName: varchar("full_name", {
    length: 255,
  }).notNull(),

  phone: varchar("phone", {
    length: 30,
  }),

  avatar: text("avatar"),

  departmentId: bigint("department_id", {
    mode: "number",
  }).references(() => departments.id),

  status: mysqlEnum("status", [
    "active",
    "inactive",
    "blocked",
  ])
    .default("active")
    .notNull(),

  lastLoginAt: timestamp("last_login_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow(),
})