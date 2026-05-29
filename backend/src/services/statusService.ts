import db from "../models/index.js";
import { StatusEnum } from "../types/serviceRequest.types.js";
import createError from "http-errors";

const validTransitions: Record<number, number[]> = {
    [StatusEnum.Created]: [StatusEnum.Assigned, StatusEnum.Cancelled],
    [StatusEnum.Assigned]: [StatusEnum.InProgress, StatusEnum.Cancelled],
    [StatusEnum.InProgress]: [StatusEnum.Completed, StatusEnum.Cancelled],
    [StatusEnum.Completed]: [],
    [StatusEnum.Cancelled]: []
};

class StatusService {
    async updateStatus(serviceRequestId: number, newStatusId: number, transaction?: any) {
        const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId, { transaction });
        if (!serviceRequest) {
            throw createError(404, "Service request not found");
        }
        const currentStatusId = serviceRequest.statusId;
        const allowed = validTransitions[currentStatusId] ?? [];

        if (!allowed.includes(newStatusId)) {
            throw createError(400, `Invalid status transition from ${StatusEnum[currentStatusId]} to ${StatusEnum[newStatusId]}`);
        }
        await serviceRequest.update({ statusId: newStatusId }, { transaction });

        await db.StatusHistory.create({
            serviceRequestId,
            oldStatusId: currentStatusId,
            newStatusId
        }, { transaction });

        if (newStatusId === StatusEnum.Cancelled || newStatusId === StatusEnum.Completed) {
            const activeAssignment = await db.JobAssignment.findOne({
                where: {
                    serviceRequestId,
                    unassignedAt: null
                }, transaction
            });

            if (activeAssignment) {
                await db.TechnicianProfile.update(
                    { isAvailable: true },
                    { where: { userId: activeAssignment.technicianId }, transaction }
                );
        }
    }
    return serviceRequest;
    }
}

export default new StatusService();