import db from '../models/index.js';
import type { Models } from '../types/model.types.js';
import { TechnicianDTO, type TechnicianAssignment } from '../DTOs/TechnicianDTO.js';
import statusService from './statusService.js';
import createError from 'http-errors';

class TechnicianService {
    constructor(private readonly db: Models) {}

    async getOneByUserId(userId: number) {
        return this.db.TechnicianProfile.findOne({ where: { userId } });
    }

    async getAssignedRequests(technicianId: number) {
        const assignments = await this.db.JobAssignment.findAll({
            where: { technicianId },
            include: [
                {
                    model: this.db.ServiceRequest,
                    as: 'ServiceRequest',
                    include: [
                        {
                            model: this.db.Service,
                            as: 'Service',
                        },
                        {
                            model: this.db.User,
                            as: 'Customer',
                            attributes: ['id', 'FirstName', 'LastName', 'Email'],
                        },
                        {
                            model: this.db.Location,
                            as: 'Location',
                            attributes: ['address', 'city', 'state', 'zipCode'],
                        },
                        {
                            model: this.db.Status,
                            as: 'Status',
                            attributes: ['status'],
                        },
                    ],
                },
                {
                    model: this.db.User,
                    as: 'Technician',
                    attributes: ['id', 'FirstName', 'LastName', 'Email'],
                },
            ],
        });
        return assignments.map((job) => new TechnicianDTO(job as TechnicianAssignment));
    }

    async updateStatus(serviceRequestId: number, statusId: number, technicianId: number) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const assignment = await this.db.JobAssignment.findOne({
                where: {
                    serviceRequestId,
                    technicianId,
                    unassignedAt: null,
                },
                transaction,
            });

            if (!assignment) {
                throw createError(
                    404,
                    'No active assignment found for this service request and technician'
                );
            }

            const updatedRequest = await statusService.updateStatus(
                serviceRequestId,
                statusId,
                transaction
            );

            await transaction.commit();

            return updatedRequest;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async getWorkloadOverview() {
        const technicians = await this.db.TechnicianProfile.findAll({
            include: [
                {
                    model: this.db.User,
                    as: 'User',
                    attributes: ['id', 'FirstName', 'LastName'],
                },
            ],
        });

        let available = 0;
        let busy = 0;
        let atCapacity = 0;

        for (const tech of technicians) {
            const activeJobs = await this.db.JobAssignment.count({
                where: {
                    technicianId: tech.id,
                    unassignedAt: null,
                },
            });

            const maxJobs = tech.maxActiveJobs ?? 3;

            if (activeJobs === 0) available++;

            if (activeJobs > 0) busy++;

            if (activeJobs >= maxJobs) atCapacity++;
        }

        return {
            totalTechnicians: technicians.length,
            available,
            busy,
            atCapacity,
        };
    }
}

export default new TechnicianService(db);
