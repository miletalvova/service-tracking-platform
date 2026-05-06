import { Service } from "../models/service.js";

export async function seedServices() {
    const services = [
        { specialization: "Plumbing", description: "All plumbing related services" },
        { specialization: "Electrical", description: "All electrical related services" },
        { specialization: "IT Support", description: "All IT related services" },
        { specialization: "Cleaning", description: "All cleaning related services" },
    ];
    for (const service of services) {
        await Service.findOrCreate({
            where: { specialization: service.specialization, description: service.description }
        });
    }
    console.log("Services seeded successfully");
}