import db from "../models/index.js";
import { Location } from "../models/location.js";
import type { LocationCreationAttributes } from "../types/location.types.js";

class LocationService {
    client: any;
    Location: typeof Location;
    constructor(db: any) {
        this.client = db.sequelize;
        this.Location = db.Location;
    }
    async create(data: LocationCreationAttributes) {
        return this.Location.create(data);
    }

    async getAll() {
        return this.Location.findAll();
    }

    async getOneById(id: number) {
        return this.Location.findByPk(id);
    }

    async update(id: number, data: LocationCreationAttributes) {
        const location = await this.Location.findByPk(id);
        if(!location) {
            throw new Error("Location not found");
        }
        return location.update(data);
    }
    
    async delete(id: number) {
        const location = await this.Location.findByPk(id);
        if(!location) {
            throw new Error("Location not found");
        }
        return location.destroy();
    }
}

export default new LocationService(db);