import { db } from "..";
import { permissions } from "../schema";

export async function seedPermissions() {
    await db.insert(permissions).values([
        {
      code: "users.read",
      description: "View users",
    },
    {
      code: "users.create",
      description: "Create users",
    },
    {
      code: "users.update",
      description: "Update users",
    },
    {
      code: "users.delete",
      description: "Delete users",
    },
    {
      code: "forms.read",
      description: "View forms",
    },
    {
      code: "forms.create",
      description: "Create forms",
    },
    {
      code: "forms.update",
      description: "Update forms",
    },
    {
      code: "forms.delete",
      description: "Delete forms",
    },
    {
      code: "workflow.approve",
      description: "Approve workflow",
    },
    {
      code: "workflow.reject",
      description: "Reject workflow",
    },
    ])
}