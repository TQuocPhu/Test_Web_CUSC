import { db } from "..";
import { departments } from "../schema";

export async function seedDepartments() {
    await db.insert(departments).values([
        {
            id: 1,
            name: "Head Office",
        },
        {
            id: 2,
            name: "Information Technology",
            parentId: 1,
        },
        {
            id: 3,
            name: "Human Resources",
            parentId: 1,
        },
        {
            id: 4,
            name: "Backend Team",
            parentId: 2,
        },
        {
            id: 5,
            name: "Frontend Team",
            parentId: 2,
        },
    ])
}