import db from "../models/index.js";
import { JobAssignment } from "../models/JobAssignment.js";
import type { JobAssignmentCreationAttributes } from "../types/jobAssignment.types.js";
import { StatusEnum } from "../types/serviceRequest.types.js";
import aiService from "./aiService.js";
import statusService from "./statusService.js";

class JobAssignmentService {
    client: any;
    JobAssignment: typeof JobAssignment;
    constructor(db: any) {
        this.client = db.sequelize;
        this.JobAssignment = db.JobAssignment;
    }

    async create({ serviceRequestId, technicianId }: JobAssignmentCreationAttributes) {
        const transaction = await this.client.transaction();
        try {
            const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId);
            if (!serviceRequest) {
            throw new Error("Service request not found");
        }
            if (serviceRequest.statusId === StatusEnum.Completed || 
                serviceRequest.statusId === StatusEnum.Cancelled
            ) {
                throw new Error("Cannot assign technician to a completed or cancelled service request");
            }

            if (serviceRequest.statusId !== StatusEnum.Created) {
                throw new Error("Technician can only be assigned when request is in 'Created' state");
            }

            const existingAssignment = await this.JobAssignment.findOne({
                where: {
                    serviceRequestId,
                    unassignedAt: null
                }, transaction
            });

            if (existingAssignment) {
                throw new Error("Service request already has an assigned technician");
            }

            const newAssignment = await this.JobAssignment.create({
                serviceRequestId,
                technicianId
            }, { transaction });

            /* await serviceRequest.update(
                { statusId: StatusEnum.Assigned },
                { transaction }
            ); */

            /* await db.StatusHistory.create({
                serviceRequestId,
                oldStatusId: StatusEnum.Created,
                newStatusId: StatusEnum.Assigned
            }, { transaction }); */
            
            await statusService.updateStatus(serviceRequestId, StatusEnum.Assigned, transaction);

            await db.TechnicianProfile.update(
                {
                    currentLocationId: serviceRequest.locationId,
                    isAvailable: false
                },
                { where: { userId: technicianId }, transaction }
            );

            await transaction.commit();

            return newAssignment;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async unassign(serviceRequestId: number) {
        const jobAssignment = await this.JobAssignment.findOne({
            where: {
                serviceRequestId,
                unassignedAt: null
            }
        });
        
        if (!jobAssignment) return;

        await jobAssignment.update({
            unassignedAt: new Date() 
        });
    }

    async getAll() {
        return this.JobAssignment.findAll();
    }

    async getOneById(id: number) {
        return this.JobAssignment.findByPk(id);
    }

    async update(id: number, data: JobAssignmentCreationAttributes) {
        const jobAssignment = await this.JobAssignment.findByPk(id);
        if(!jobAssignment) {
            throw new Error("Job Assignmengt not found");
        }
        return jobAssignment.update(data);
    }

    async delete(id: number) {
        const jobAssignment = await this.JobAssignment.findByPk(id);
        if(!jobAssignment) {
            throw new Error("Job Assignmengt not found")
        }
        return jobAssignment.destroy();
    }

    async recommendTechnician(serviceRequestId: number) {
        const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId);

        const technicians = await db.User.findAll({
            include: [
                {
                    model: db.Role,
                    as: "Role",
                    where: { name: "Technician" },
                },
            ],
        });

        const aiResult = await aiService.recommendTechnician(serviceRequest, technicians);
        return this.create({
            serviceRequestId,
            technicianId: aiResult.technicianId
        });
        ///add status history changes
    }
}

export default new JobAssignmentService(db);
