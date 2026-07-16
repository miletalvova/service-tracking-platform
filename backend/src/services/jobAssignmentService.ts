import db from '../models/index.js';
import { JobAssignment } from '../models/JobAssignment.js';
import { TechnicianProfile } from '../models/TechnicianProfile.js';
import type { JobAssignmentCreationAttributes } from '../types/jobAssignment.types.js';
import { StatusEnum } from '../types/serviceRequest.types.js';
import aiService from './aiService.js';
import statusService from './statusService.js';
import createError from 'http-errors';

class JobAssignmentService {
    client: any;
    JobAssignment: typeof JobAssignment;
    TechnicianProfile: typeof TechnicianProfile;
    constructor(db: any) {
        this.client = db.sequelize;
        this.JobAssignment = db.JobAssignment;
        this.TechnicianProfile = db.TechnicianProfile;
    }

    async create({ serviceRequestId, technicianId }: JobAssignmentCreationAttributes) {
        const transaction = await this.client.transaction();
        try {
            const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId, {
                transaction,
            });

            if (!serviceRequest) {
                throw createError(404, 'Service request not found');
            }
            if (
                serviceRequest.statusId === StatusEnum.Completed ||
                serviceRequest.statusId === StatusEnum.Cancelled
            ) {
                throw createError(
                    400,
                    'Cannot assign technician to a completed or cancelled service request'
                );
            }

            if (serviceRequest.statusId !== StatusEnum.Created) {
                throw createError(
                    400,
                    "Technician can only be assigned when request is in 'Created' state"
                );
            }

            const existingAssignment = await this.JobAssignment.findOne({
                where: {
                    serviceRequestId,
                    unassignedAt: null,
                },
                transaction,
            });

            if (existingAssignment) {
                throw createError(409, 'Service request already has an assigned technician');
            }

            const newAssignment = await this.JobAssignment.create(
                {
                    serviceRequestId,
                    technicianId,
                },
                { transaction }
            );

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
                },
                { where: { userId: technicianId }, transaction }
            );

            await transaction.commit();

            return newAssignment;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async unassign(serviceRequestId: number) {
        const jobAssignment = await this.JobAssignment.findOne({
            where: {
                serviceRequestId,
                unassignedAt: null,
            },
        });

        if (!jobAssignment) return;

        await jobAssignment.update({
            unassignedAt: new Date(),
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
        if (!jobAssignment) {
            throw createError(404, 'Job Assignment not found');
        }
        return jobAssignment.update(data);
    }

    async delete(id: number) {
        const jobAssignment = await this.JobAssignment.findByPk(id);

        if (!jobAssignment) {
            throw createError(404, 'Job Assignment not found');
        }

        return jobAssignment.destroy();
    }

    async recommendTechnician(serviceRequestId: number) {
        const transaction = await this.client.transaction();
        const serviceRequest = await db.ServiceRequest.findByPk(serviceRequestId, { transaction });

        if (!serviceRequest) {
            throw createError(404, 'Service request not found');
        }

        const technicians = await db.User.findAll({
            include: [
                {
                    model: db.Role,
                    as: 'Role',
                    where: { name: 'Technician' },
                },
                {
                    model: db.TechnicianProfile,
                    as: 'TechnicianProfile',
                    include: [
                        {
                            model: db.Location,
                            as: 'CurrentLocation',
                        },
                    ],
                },
            ],
        });

        const techniciansWithWorkload = await Promise.all(
            technicians.map(async (tech) => {
                const activeJobsCount = await db.JobAssignment.count({
                    where: {
                        technicianId: tech.id,
                        unassignedAt: null,
                    },
                });
                return {
                    id: tech.id,
                    name: `${tech.FirstName} ${tech.LastName}`,
                    skills: tech.TechnicianProfile?.skills ?? '',
                    isAvailable: tech.TechnicianProfile?.isAvailable ?? false,
                    activeJobs: activeJobsCount,
                    maxActiveJobs: tech.TechnicianProfile?.maxActiveJobs ?? 3,
                    currentLocation: tech.TechnicianProfile?.CurrentLocation ?? null,
                };
            })
        );

        const availableTechnicians = techniciansWithWorkload.filter(
            (tech) => tech.isAvailable && tech.activeJobs < tech.maxActiveJobs
        );

        if (availableTechnicians.length === 0) {
            throw createError(409, 'No available technicians at the moment');
        }

        const aiResult = await aiService.recommendTechnician(serviceRequest, availableTechnicians);
        console.log('AI Recommendation Result:', aiResult);
        console.log('All Available Technicians:', JSON.stringify(availableTechnicians, null, 2));

        if (!aiResult.technicianId) {
            throw createError(
                409,
                aiResult?.reason ?? 'No suitable technician found for this request'
            );
        }

        const technicianExists = availableTechnicians.find(
            (tech) => tech.id === aiResult.technicianId
        );
        if (!technicianExists) {
            throw createError(
                500,
                `AI recommended technicianId ${aiResult.technicianId} which is not in the available list`
            );
        }

        return this.create({
            serviceRequestId,
            technicianId: aiResult.technicianId,
        });
        ///add status history changes
    }
}

export default new JobAssignmentService(db);
