import db from "../models/index.js";
import type { ServiceRequest } from "../models/ServiceRequest.js";
import type { User } from "../models/user.js";
import type { ServiceRequestCreationAttributes } from "../types/serviceRequest.types.js";

class ServiceRequestService {
        client: any;
        ServiceRequest: typeof ServiceRequest;
        User: typeof User;
        constructor(db: any) {
            this.client = db.sequelize;
            this.ServiceRequest = db.ServiceRequest;
            this.User = db.User;
        }

        async create(data: ServiceRequestCreationAttributes) {
            return this.ServiceRequest.create(data);
        }

        async getAll() {
            return this.ServiceRequest.findAll();
        }

        async getOneById(id: number) {
            return this.ServiceRequest.findByPk(id);
        }

        async getOneByCustomerId(customerId: number) {
            return this.ServiceRequest.findAll({
                where: { customerId },
                include: [{ model: this.User, as: "Customer" }]
            });
        }
}

export default new ServiceRequestService(db);