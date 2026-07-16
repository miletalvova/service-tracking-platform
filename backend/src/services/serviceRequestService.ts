import db from '../models/index.js';
import type { ServiceRequest } from '../models/ServiceRequest.js';
import type { User } from '../models/user.js';
import type { Location } from '../models/location.js';
import {
    type ServiceRequestCreationAttributes,
    type SmartServiceRequestCreationAttributes,
    type ServiceRequestAttributes,
    StatusEnum,
    type LocationSuggestion,
} from '../types/serviceRequest.types.js';
import type { StatusHistory } from '../models/StatusHistory.js';
import jobAssignmentService from './jobAssignmentService.js';
import AIService from './aiService.js';
import createError from 'http-errors';
import { Op } from 'sequelize';
import { stat } from 'fs';

const statusMap = {
    created: StatusEnum.Created,
    assigned: StatusEnum.Assigned,
    inprogress: StatusEnum.InProgress,
    completed: StatusEnum.Completed,
    cancelled: StatusEnum.Cancelled,
};

class ServiceRequestService {
    client: any;
    ServiceRequest: typeof ServiceRequest;
    User: typeof User;
    StatusHistory: typeof StatusHistory;
    Service: typeof db.Service;
    Status: typeof db.Status;
    JobAssignment: typeof db.JobAssignment;
    Location: typeof db.Location;
    constructor(db: any) {
        this.client = db.sequelize;
        this.ServiceRequest = db.ServiceRequest;
        this.User = db.User;
        this.StatusHistory = db.StatusHistory;
        this.Service = db.Service;
        this.Status = db.Status;
        this.JobAssignment = db.JobAssignment;
        this.Location = db.Location;
    }

    async create({
        customerId,
        serviceId,
        locationId,
        description,
    }: ServiceRequestCreationAttributes) {
        const serviceRequest = await this.ServiceRequest.create({
            customerId,
            serviceId,
            statusId: 1,
            locationId,
            description,
            priority: 'Medium',
        });

        await this.StatusHistory.create({
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
        const transaction = await this.client.transaction();
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

            let service = await this.Service.findOne({
                where: { specialization: aiResult.service },
                transaction,
            });

            if (!service) {
                service = await this.Service.create(
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

            const serviceRequest = await this.ServiceRequest.create(
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

            await this.StatusHistory.create(
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
        return this.ServiceRequest.findAll({
            where,
            include: [
                {
                    model: this.Status,
                    as: 'Status',
                },
                {
                    model: this.Service,
                    as: 'Service',
                },
                {
                    model: this.User,
                    as: 'Customer',
                    attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                },
                {
                    model: this.JobAssignment,
                    as: 'JobAssignments',
                    include: [
                        {
                            model: this.User,
                            as: 'Technician',
                            attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                        },
                    ],
                },
            ],
        });
    }

    async getOneById(id: number) {
        return this.ServiceRequest.findByPk(id);
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
        return this.ServiceRequest.findAll({
            where: {
                customerId,
                statusId: {
                    [Op.in]: statusIds,
                },
            },
            include: [
                {
                    model: this.User,
                    as: 'Customer',
                    attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                },
                {
                    model: this.Status,
                    as: 'Status',
                },
                {
                    model: this.JobAssignment,
                    as: 'JobAssignments',
                    required: false,
                    where: { unassignedAt: null },
                    include: [
                        {
                            model: this.User,
                            as: 'Technician',
                            attributes: ['id', 'FirstName', 'LastName', 'Email', 'Username'],
                        },
                    ],
                },
                {
                    model: this.Service,
                    as: 'Service',
                },
                {
                    model: this.Location,
                    as: 'Location',
                },
                {
                    model: this.StatusHistory,
                    as: 'StatusHistory',
                    include: [
                        {
                            model: this.Status,
                            as: 'OldStatus',
                        },
                        {
                            model: this.Status,
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
        const serviceRequest = await this.ServiceRequest.findByPk(id);

        if (!serviceRequest) {
            throw createError(404, 'Service request not found');
        }

        const oldStatusId = serviceRequest.statusId;

        await serviceRequest.update(data);

        if (data.statusId && data.statusId !== oldStatusId) {
            await this.StatusHistory.create({
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
        const serviceRequest = await this.ServiceRequest.findByPk(id);

        if (!serviceRequest) {
            throw createError(404, 'Service request not found');
        }

        return serviceRequest.destroy();
    }
}

export default new ServiceRequestService(db);
