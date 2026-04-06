import db from "../models/index.js";
import type { ServiceRequest } from "../models/ServiceRequest.js";
import type { User } from "../models/user.js";
import { type ServiceRequestCreationAttributes, type ServiceRequestAttributes, StatusEnum } from "../types/serviceRequest.types.js";
import type { StatusHistory } from "../models/StatusHistory.js";
import jobAssignmentService from "./jobAssignmentService.js";

class ServiceRequestService {
        client: any;
        ServiceRequest: typeof ServiceRequest;
        User: typeof User;
        StatusHistory: typeof StatusHistory;
        constructor(db: any) {
            this.client = db.sequelize;
            this.ServiceRequest = db.ServiceRequest;
            this.User = db.User;
            this.StatusHistory = db.StatusHistory;
        }

        async create({ customerId, serviceId, locationId }: ServiceRequestCreationAttributes) {
            const serviceRequest = await this.ServiceRequest.create({
                customerId, 
                serviceId, 
                statusId: 1, 
                locationId 
            });

            await this.StatusHistory.create({
                serviceRequestId: serviceRequest.id,
                oldStatusId: 1,
                newStatusId: 1
            });
            return serviceRequest;
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

        async update(id: number, data: Partial<ServiceRequestAttributes>) {
            const serviceRequest = await this.ServiceRequest.findByPk(id);

            if (!serviceRequest) {
                throw new Error("Service request not found");
            }

            const oldStatusId = serviceRequest.statusId;
        
            await serviceRequest.update(data);

            if (data.statusId && data.statusId !== oldStatusId) {
            await this.StatusHistory.create({
                serviceRequestId: id,
                oldStatusId,
                newStatusId: data.statusId
            })
        }
        
        if (data.statusId === StatusEnum.Completed || data.statusId === StatusEnum.Cancelled) {
            await jobAssignmentService.unassign(id);
        }

            return serviceRequest;
        }

        async delete(id: number) {
            const serviceRequest = await this.ServiceRequest.findByPk(id);
            if (!serviceRequest) {
                throw new Error("Service request not found");
            }
            return serviceRequest.destroy();
        }
}

export default new ServiceRequestService(db);