import { Role } from "../models/role.js";

export async function seedRoles() {
    const roles = ["Customer", "Staff", "Technician"];
    for (const roleName of roles) {
        await Role.findOrCreate({
            where: { name: roleName }
        });
    }
    console.log("Roles seeded successfully.");
}