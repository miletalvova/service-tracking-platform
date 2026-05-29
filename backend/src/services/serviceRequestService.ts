import db from "../models/index.js";
import type { ServiceRequest } from "../models/ServiceRequest.js";
import type { User } from "../models/user.js";
import { type ServiceRequestCreationAttributes, type SmartServiceRequestCreationAttributes, type ServiceRequestAttributes, StatusEnum } from "../types/serviceRequest.types.js";
import type { StatusHistory } from "../models/StatusHistory.js";
import jobAssignmentService from "./jobAssignmentService.js";
import AIService from "./aiService.js";
import createError from "http-errors";

class ServiceRequestService {
        client: any;
        ServiceRequest: typeof ServiceRequest;
        User: typeof User;
        StatusHistory: typeof StatusHistory;
        Service: typeof db.Service;
        constructor(db: any) {
            this.client = db.sequelize;
            this.ServiceRequest = db.ServiceRequest;
            this.User = db.User;
            this.StatusHistory = db.StatusHistory;
            this.Service = db.Service;
        }

        async create({ customerId, serviceId, locationId, description }: ServiceRequestCreationAttributes) {
            const serviceRequest = await this.ServiceRequest.create({
                customerId, 
                serviceId, 
                statusId: 1, 
                locationId,
                description,
                priority: "Medium"
            });

            await this.StatusHistory.create({
                serviceRequestId: serviceRequest.id,
                oldStatusId: 1,
                newStatusId: 1
            });
            return serviceRequest;
        }

        async createSmart({ customerId, description, locationId }: SmartServiceRequestCreationAttributes) {
            const transaction = await this.client.transaction();
            try {
                let aiResult;
                let urgencyResult;
                let finalPriority: "Low" | "Medium" | "High" = "Medium";

                try {
                    [aiResult, urgencyResult] = await Promise.all([
                        AIService.classifyRequest(description),
                        AIService.detectUrgency(description)
                    ]);

                    finalPriority = urgencyResult.isUrgent ? "High" : aiResult.priority;
                }
                catch (error) {
                    console.error("AI classification failed, falling back to default values. Error:", error);
                    aiResult = {
                        service: "IT Support",
                        cleanDescription: description,
                        priority: "Medium"
                    };
                }

            let service = await this.Service.findOne({ where: { specialization: aiResult.service }, transaction });
            
            if (!service) {
                service = await this.Service.create({ 
                    specialization: aiResult.service, 
                    description: `All ${aiResult.service.toLowerCase()} related services` }, { transaction });
            }

            const serviceRequest = await this.ServiceRequest.create({
                customerId,
                serviceId: service.id,
                statusId: StatusEnum.Created,
                locationId,
                description: aiResult.cleanDescription,
                priority: finalPriority
            }, { transaction });

            console.log({
                event: "ai_classification",
                input: description.slice(0, 100),
                output: aiResult,
                urgency: urgencyResult,
                timestamp: new Date().toISOString()
            })

        await this.StatusHistory.create({
            serviceRequestId: serviceRequest.id,
            oldStatusId: 1,
            newStatusId: 1
        }, { transaction });

        await transaction.commit();

        return serviceRequest;
        } catch (err) {
            await transaction.rollback();
            throw err;
            }
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
                throw createError(404, "Service request not found");
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
                throw createError(404, "Service request not found");
            }
            
            return serviceRequest.destroy();
        }

}

export default new ServiceRequestService(db);