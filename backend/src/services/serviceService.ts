import db from "../models/index.js";
import type { Service } from "../models/service.js";
import type { ServiceCreationAttributes } from "../types/service.types.js";

class ServiceService {
    client: any;
    Service: typeof Service;
    constructor(db: any) {
        this.client = db.sequelize;
        this.Service = db.Service;
    }
    async getAll() {
        return this.Service.findAll();
    }

    async getOneById(id: number) {
        return this.Service.findByPk(id);
    }

    async create(data: ServiceCreationAttributes) {
        return this.Service.create(data);
    }

    async update(id: number, data: Partial<ServiceCreationAttributes>) {
        const service = await this.Service.findByPk(id);
        if (!service) {
            throw new Error("Service not found");
        }
        return service.update(data);
    }

    async delete(id: number) {
        const service = await this.Service.findByPk(id);
        if (!service) {
            throw new Error("Service not found");
        }
        return service.destroy();
    }

}

export default new ServiceService(db);
