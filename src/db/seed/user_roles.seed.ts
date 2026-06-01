import { db } from "..";
import { userRoles } from "../schema";

export async function seedUserRoles() {
    await db.insert(userRoles).values([
        {
            userId: 1,
            roleId: 1,
        },
        {
            userId: 2,
            roleId: 2,
        },
        {
            userId: 3,
            roleId: 3,
        },
        {
            userId: 4,
            roleId: 4,
        },
    ])
}