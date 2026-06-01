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
import { roles } from "./roles.schema";
import { permissions } from "./permissions.schema";

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: bigint("role_id", {
      mode: "number",
    }).notNull().references(() => roles.id),

    permissionId: bigint("permission_id", {
      mode: "number",
    }).notNull().references(() => permissions.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.roleId, table.permissionId],
    }),
  })
);