import { sql } from "drizzle-orm";
import { db } from "..";
import { seedDepartments } from "./departments.seed";
import { seedPermissions } from "./permissions.seed";
import { seedRolePermissions } from "./role_permissions.seed";
import { seedRoles } from "./roles.seed";
import { seedUserRoles } from "./user_roles.seed";
import { seedUsers } from "./users.seed";

async function clearDatabase() {
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

  await db.execute(sql`TRUNCATE TABLE role_permissions`);
  await db.execute(sql`TRUNCATE TABLE user_roles`);
  await db.execute(sql`TRUNCATE TABLE permissions`);
  await db.execute(sql`TRUNCATE TABLE roles`);
  await db.execute(sql`TRUNCATE TABLE users`);
  await db.execute(sql`TRUNCATE TABLE departments`);

  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
}

async function main() {
    await clearDatabase();
    console.log("Start seeding...");

    await seedDepartments();
    await seedRoles();
    await seedPermissions();
    await seedUsers();
    await seedUserRoles();
    await seedRolePermissions();

    console.log("Database seeded");
    process.exit(0);
}

main().catch((err) => {
    console.log(err)
    console.error(err);
    process.exit(1);
})