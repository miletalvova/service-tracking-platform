import db from '../models/index.js';
import type { ServiceCreationAttributes } from '../types/service.types.js';
import type { Models } from '../types/model.types.js';
import createError from 'http-errors';

class ServiceService {
    constructor(private readonly db: Models) {}
    async getAll() {
        return this.db.Service.findAll();
    }

    async getOneById(id: number) {
        return this.db.Service.findByPk(id);
    }

    async create(data: ServiceCreationAttributes) {
        return this.db.Service.create(data);
    }

    async update(id: number, data: Partial<ServiceCreationAttributes>) {
        const service = await this.db.Service.findByPk(id);

        if (!service) {
            throw createError(404, 'Service not found');
        }

        return service.update(data);
    }

    async delete(id: number) {
        const service = await this.db.Service.findByPk(id);
        if (!service) {
            throw createError(404, 'Service not found');
        }
        return service.destroy();
    }
}

export default new ServiceService(db);
