import { Service } from "../models/service.js";

export async function seedServices() {
    const services = [
        { serviceType: "Plumbing", description: "All plumbing related services" },
        { serviceType: "Electrical", description: "All electrical related services" },
        { serviceType: "IT", description: "All IT related services" },
    ];
    for (const service of services) {
        await Service.findOrCreate({
            where: { serviceType: service.serviceType, description: service.description }
        });
    }
    console.log("Services seeded successfully");
}