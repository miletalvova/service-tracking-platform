import db from '../models/index.js';
import type { LocationCreationAttributes } from '../types/location.types.js';
import type { Models } from '../types/model.types.js';
import createError from 'http-errors';

class LocationService {
    constructor(private readonly db: Models) {
    }
    async create(data: LocationCreationAttributes) {
        return this.db.Location.create(data);
    }

    async getAll() {
        return this.db.Location.findAll();
    }

    async getOneById(id: number) {
        return this.db.Location.findByPk(id);
    }

    async update(id: number, data: LocationCreationAttributes) {
        const location = await this.db.Location.findByPk(id);
        if (!location) {
            throw createError(404, 'Location not found');
        }
        return location.update(data);
    }

    async delete(id: number) {
        const location = await this.db.Location.findByPk(id);
        if (!location) {
            throw createError(404, 'Location not found');
        }
        return location.destroy();
    }
}

export default new LocationService(db);
