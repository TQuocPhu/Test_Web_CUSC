import { db } from "..";
import { users } from "../schema";

export async function seedUsers() {
  await db.insert(users).values([
    {
      email: "superadmin@company.com",
      password: "hashed_password",
      fullName: "System Super Admin",
      phone: "0900000001",
      departmentId: 1,
      status: "active",
    },

    {
      email: "admin@company.com",
      password: "hashed_password",
      fullName: "System Admin",
      phone: "0900000002",
      departmentId: 1,
      status: "active",
    },
    {
      email: "manager.hr@company.com",
      password: "hashed_password",
      fullName: "HR Manager",
      phone: "0900000003",
      departmentId: 2,
      status: "active",
    },
    {
      email: "employee1@company.com",
      password: "hashed_password",
      fullName: "Nguyen Van A",
      phone: "0900000004",
      departmentId: 4,
      status: "active",
    },
  ]);
}
