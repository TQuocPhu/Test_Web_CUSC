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
import { users } from "./users.schema";
import { roles } from "./roles.schema";

export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: bigint("user_id", {
      mode: "number",
    }).notNull().references(() => users.id),

    roleId: bigint("role_id", {
      mode: "number",
    }).notNull().references(() => roles.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.roleId],
    }),
  })
);