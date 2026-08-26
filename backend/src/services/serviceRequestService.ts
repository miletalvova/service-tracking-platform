import db from '../models/index.js';
import type { Models } from '../types/model.types.js';
import {
    type ServiceRequestCreationAttributes,
    type SmartServiceRequestCreationAttributes,
    type ServiceRequestAttributes,
    StatusEnum,
} from '../types/serviceRequest.types.js';
import jobAssignmentService from './jobAssignmentService.js';
import AIService from './aiService.js';
import createError from 'http-errors';
import { Op } from 'sequelize';

const statusMap = {
    created: StatusEnum.Created,
    assigned: StatusEnum.Assigned,
    inprogress: StatusEnum.InProgress,
    completed: StatusEnum.Completed,
    cancelled: StatusEnum.Cancelled,
};

class ServiceRequestService {
    constructor(private readonly db: Models) {}

    async create({
        customerId,
        serviceId,
        locationId,
        description,
    }: ServiceRequestCreationAttributes) {
        const serviceRequest = await this.db.ServiceRequest.create({
            customerId,
            serviceId,
            statusId: 1,
            locationId,
            description,
            priority: 'Medium',
        });

        await this.db.StatusHistory.create({
            serviceRequestId: serviceRequest.id,
            oldStatusId: 1,
            newStatusId: 1,
        });
        return serviceRequest;
    }

    async createSmart({
        customerId,
        description,
        location,
    }: SmartServiceRequestCreationAttributes) {
        const transaction = await this.db.sequelize.transaction();
        try {
            let aiResult;
            let urgencyResult;
            let finalPriority: 'Low' | 'Medium' | 'High' = 'Medium';

            try {
                [aiResult, urgencyResult] = await Promise.all([
                    AIService.classifyRequest(description),
                    AIService.detectUrgency(description),
                ]);

                finalPriority = urgencyResult.isUrgent ? 'High' : aiResult.priority;
            } catch (error) {
                console.error(
                    'AI classification failed, falling back to default values. Error:',
                    error
                );
                aiResult = {
                    service: 'IT Support',
                    cleanDescription: description,
                    priority: 'Medium',
                };
            }

            let service = await this.db.Service.findOne({
                where: { specialization: aiResult.service },
                transaction,
            });

            if (!service) {
                service = await this.db.Service.create(
                    {
                        specialization: aiResult.service,
                        description: `All ${aiResult.service.toLowerCase()} related services`,
                    },
                    { transaction }
                );
            }

            const locationRecord = await db.Location.create(
                {
                    address: location.display_name,
                    city:
                        location.address.city ??
                        location.address.town ??
                        location.address.village ??
                        '',
                    state: location.address.state ?? '',
                    zipCode: location.address.postcode ?? '',
                },
                {
                    transaction,
                }
            );

            const serviceRequest = await this.db.ServiceRequest.create(
                {
                    customerId,
                    serviceId: service.id,
                    statusId: StatusEnum.Created,
                    locationId: locationRecord.id,
                    description: aiResult.cleanDescription,
                    priority: finalPriority,
                },
                { transaction }
            );

            console.log({
                event: 'ai_classification',
                input: description.slice(0, 100),
                output: aiResult,
                urgency: urgencyResult,
                timestamp: new Date().toISOString(),
            });

            await this.db.StatusHistory.create(
                {
                    serviceRequestId: serviceRequest.id,
                    oldStatusId: 1,
                    newStatusId: 1,
                },
                { transaction }
            );

            await transaction.commit();

            return serviceRequest;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async getAll(status = 'all') {
        const where =
            status === 'all' ? {} : { statusId: statusMap[status as keyof typeof statusMap] };
        return this.db.ServiceRequest.findAll({
            where,
            include: [
                {
                    model: this.db.Status,
                    as: 'Status',
                },
                {
                    model: this.db.Service,
                    as: 'Service',
                },
                {
                    model: this.db.User,
                    as: 'Customer',
                    attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                },
                {
                    model: this.db.JobAssignment,
                    as: 'JobAssignments',
                    include: [
                        {
                            model: this.db.User,
                            as: 'Technician',
                            attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                        },
                    ],
                },
            ],
        });
    }

    async getOneById(id: number) {
        return this.db.ServiceRequest.findByPk(id);
    }

    async getCustomerRequests(customerId: number, status: string = 'active') {
        let statusIds: number[];

        switch (status) {
            case 'history':
                statusIds = [StatusEnum.Completed, StatusEnum.Cancelled];
                break;

            case 'all':
                statusIds = [
                    StatusEnum.Created,
                    StatusEnum.Assigned,
                    StatusEnum.InProgress,
                    StatusEnum.Completed,
                    StatusEnum.Cancelled,
                ];
                break;

            default:
                statusIds = [StatusEnum.Created, StatusEnum.Assigned, StatusEnum.InProgress];
        }
        return this.db.ServiceRequest.findAll({
            where: {
                customerId,
                statusId: {
                    [Op.in]: statusIds,
                },
            },
            include: [
                {
                    model: this.db.User,
                    as: 'Customer',
                    attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                },
                {
                    model: this.db.Status,
                    as: 'Status',
                },
                {
                    model: this.db.JobAssignment,
                    as: 'JobAssignments',
                    required: false,
                    where: { unassignedAt: null },
                    include: [
                        {
                            model: this.db.User,
                            as: 'Technician',
                            attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                        },
                    ],
                },
                {
                    model: this.db.Service,
                    as: 'Service',
                },
                {
                    model: this.db.Location,
                    as: 'Location',
                },
                {
                    model: this.db.StatusHistory,
                    as: 'StatusHistory',
                    include: [
                        {
                            model: this.db.Status,
                            as: 'OldStatus',
                        },
                        {
                            model: this.db.Status,
                            as: 'NewStatus',
                        },
                    ],
                    separate: true,
                    order: [['changedAt', 'ASC']],
                },
            ],
            order: [['updatedAt', 'DESC']],
        });
    }

    async update(id: number, data: Partial<ServiceRequestAttributes>) {
        const serviceRequest = await this.db.ServiceRequest.findByPk(id);

        if (!serviceRequest) {
            throw createError(404, 'Service request not found');
        }

        const oldStatusId = serviceRequest.statusId;

        await serviceRequest.update(data);

        if (data.statusId && data.statusId !== oldStatusId) {
            await this.db.StatusHistory.create({
                serviceRequestId: id,
                oldStatusId,
                newStatusId: data.statusId,
            });
        }

        if (data.statusId === StatusEnum.Completed || data.statusId === StatusEnum.Cancelled) {
            await jobAssignmentService.unassign(id);
        }

        return serviceRequest;
    }

    async delete(id: number) {
        const serviceRequest = await this.db.ServiceRequest.findByPk(id);

        if (!serviceRequest) {
            throw createError(404, 'Service request not found');
        }

        return serviceRequest.destroy();
    }
}

export default new ServiceRequestService(db);
