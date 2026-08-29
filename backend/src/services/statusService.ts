import db from '../models/index.js';
import { StatusEnum } from '../types/serviceRequest.types.js';
import createError from 'http-errors';
import type { Models } from '../types/model.types.js';
import type { Transaction } from "sequelize";

const validTransitions: Record<number, number[]> = {
    [StatusEnum.Created]: [StatusEnum.Assigned, StatusEnum.Cancelled],
    [StatusEnum.Assigned]: [StatusEnum.InProgress, StatusEnum.Cancelled],
    [StatusEnum.InProgress]: [StatusEnum.Completed, StatusEnum.Cancelled],
    [StatusEnum.Completed]: [],
    [StatusEnum.Cancelled]: [],
};

class StatusService {
    constructor(private readonly db: Models) {}

    async updateStatus(serviceRequestId: number, newStatusId: number, transaction: Transaction) {
        const serviceRequest = await this.db.ServiceRequest.findByPk(serviceRequestId, { transaction });
        if (!serviceRequest) {
            throw createError(404, 'Service request not found');
        }
        const currentStatusId = serviceRequest.statusId;
        const allowed = validTransitions[currentStatusId] ?? [];

        if (!allowed.includes(newStatusId)) {
            throw createError(
                400,
                `Invalid status transition from ${StatusEnum[currentStatusId]} to ${StatusEnum[newStatusId]}`
            );
        }
        await serviceRequest.update({ statusId: newStatusId }, { transaction });

        await this.db.StatusHistory.create(
            {
                serviceRequestId,
                oldStatusId: currentStatusId,
                newStatusId,
            },
            { transaction }
        );

        if (newStatusId === StatusEnum.Cancelled || newStatusId === StatusEnum.Completed) {
            const activeAssignment = await this.db.JobAssignment.findOne({
                where: {
                    serviceRequestId,
                    unassignedAt: null,
                },
                transaction,
            });

            if (activeAssignment) {
                await this.db.TechnicianProfile.update(
                    { isAvailable: true },
                    { where: { userId: activeAssignment.technicianId }, transaction }
                );
            }
        }
        return serviceRequest;
    }

    async getAllStatuses (){
        return this.db.Status.findAll();
    }
    
}

export default new StatusService(db);
