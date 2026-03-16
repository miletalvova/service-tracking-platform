import { Status } from "../models/status.js";

export async function seedStatuses() {
    const statuses = [ "Created", "Assigned", "In Progress", "Completed","Cancelled" ];

    for (const statusName of statuses) {
        await Status.findOrCreate({ 
            where: { status: statusName }
        });
    }
    console.log("Statuses seeded successfully.");
}