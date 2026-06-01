import { db } from "..";
import { rolePermissions } from "../schema";

export async function seedRolePermissions() {
    const rolePermissionValues = [];

    for (let permissionId = 1; permissionId <= 10; permissionId++) {
        rolePermissionValues.push({
            roleId: 1,
            permissionId,
        })
    }

    for (let permissionId = 1; permissionId <= 8; permissionId++) {
        rolePermissionValues.push({
            roleId: 2,
            permissionId,
        });
    }
    rolePermissionValues.push(
        {
            roleId: 3,
            permissionId: 5,
        },
        {
            roleId: 3,
            permissionId: 9,
        },
        {
            roleId: 3,
            permissionId: 10,
        });

    rolePermissionValues.push({
        roleId: 4,
        permissionId: 5,
    });

    await db.insert(rolePermissions).values(rolePermissionValues);
}