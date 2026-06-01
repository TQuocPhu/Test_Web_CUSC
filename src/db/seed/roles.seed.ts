import { db } from "..";
import { roles } from "../schema";

export async function seedRoles() {
    await db.insert(roles).values([
        {
            name: "super_admin",
            description: "Full system access",
        },
        {
            name: "admin",
            description: "System administrator",
        },
        {
            name: "manager",
            description: "Department manager",
        },
        {
            name: "employee",
            description: "Normal employee",
        },
        {
            name: "reviewer",
            description: "Workflow reviewer",
        },
    ])
}