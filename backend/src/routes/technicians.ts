import { Router } from 'express';
const router = Router();
import type { Request, Response, NextFunction } from 'express';
import TechnicianService from '../services/technicianService.js';
import { isAuth, isTechnician, isStaff } from '../middleware/auth.js';
import jobAssignmentService from '../services/jobAssignmentService.js';
import { StatusEnum } from '../types/serviceRequest.types.js';

router.get(
    '/assigned-requests',
    isAuth,
    isTechnician,
    async (req: Request, res: Response, next: NextFunction) => {
        // #swagger.tags = ['Technicians']
        // #swagger.summary = 'Get all assigned requests'
        // #swagger.description = 'Endpoint to get all assigned requests'
        // #swagger.produces = ['application/json']
        /* #swagger.security = [{"JWT": [] }] */
        /* #swagger.responses[200] = {
        description: 'List of assigned requests retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'List of assigned requests' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Technician' } 
                            }
                        }
                    }
                }
            }
        }
    }*/
        /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
        /* #swagger.responses[403] = { $ref: '#/components/responses/Forbidden' } */
        /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

        try {
            const technicianId = (req as any).user.id;

            const assignedRequests = await TechnicianService.getAssignedRequests(technicianId);
            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'List of assigned requests',
                    data: assignedRequests,
                });
        } catch (err) {
            return next(err);
        }
    }
);

router.get(
    '/workload',
    isAuth,
    isStaff,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const techWorkload = await TechnicianService.getWorkloadOverview();
            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Technician workload overview',
                    data: techWorkload,
                });
        } catch (err) {
            return next(err);
        }
    }
);

router.patch(
    '/:id/status',
    isAuth,
    isTechnician,
    async (req: Request, res: Response, next: NextFunction) => {
        // #swagger.tags = ['Technicians']
        // #swagger.summary = 'Updates a status of the assignment'
        // #swagger.description = 'Endpoint to update a status of the assignment'
        // #swagger.produces = ['application/json']
        // #swagger.consumes = ['application/json']
        /* #swagger.security = [{"JWT": [] }] */
        /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Service ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
        /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/StatusUpdateInput' }
            }
        }
    } */
        /* #swagger.responses[200] = {
        description: 'Status updated successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Status updated successfully' },
                        data: { $ref: '#/components/schemas/Technician' }
                    }
                }
            }
        }
    } */
        /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
        /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
        /* #swagger.responses[403] = { $ref: '#/components/responses/Forbidden' } */
        /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
        /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

        try {
            const serviceRequestId = Number(req.params.id);

            if (Number.isNaN(serviceRequestId)) {
                return res
                    .status(400)
                    .json({
                        status: 'error',
                        statusCode: 400,
                        message: 'Service Request ID must be a number',
                    });
            }

            const technicianId = (req as any).user.id;
            const { statusId } = req.body;

            if (!statusId) {
                return res
                    .status(400)
                    .json({ status: 'error', statusCode: 400, message: 'statusId is required' });
            }

            const updatedRequest = await TechnicianService.updateStatus(
                serviceRequestId,
                statusId,
                technicianId
            );

            if (statusId === StatusEnum.Completed || statusId === StatusEnum.Cancelled) {
                await jobAssignmentService.unassign(serviceRequestId);
            }

            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Status updated successfully',
                    data: updatedRequest,
                });
        } catch (err) {
            return next(err);
        }
    }
);

router.patch(
    '/profile',
    isAuth,
    isTechnician,
    async (req: Request, res: Response, next: NextFunction) => {
        // #swagger.tags = ['Technicians']
        // #swagger.summary = 'Updates a profile'
        // #swagger.description = 'Endpoint to update a profile'
        // #swagger.produces = ['application/json']
        // #swagger.consumes = ['application/json']
        /* #swagger.security = [{"JWT": [] }] */
        /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/TechnicianUpdateInput' }
            }
        }
    } */
        /* #swagger.responses[200] = {
        description: 'Technician profile successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Profile updated successfully' },
                        data: { $ref: '#/components/schemas/TechnicianProfile' }
                    }
                }
            }
        }
    } */
        /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
        /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
        /* #swagger.responses[403] = { $ref: '#/components/responses/Forbidden' } */
        /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
        /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

        try {
            const userId = (req as any).user.id;
            const { skills, isAvailable, currentLocationId, maxActiveJobs } = req.body;

            if (
                skills === undefined &&
                isAvailable === undefined &&
                currentLocationId === undefined &&
                maxActiveJobs === undefined
            ) {
                return res
                    .status(400)
                    .json({
                        status: 'error',
                        statusCode: 400,
                        message: 'At least one field must be provided',
                    });
            }

            const profile = await TechnicianService.getOneByUserId(userId);

            if (!profile) {
                return res
                    .status(404)
                    .json({
                        status: 'error',
                        statusCode: 404,
                        message: 'Technician profile not found',
                    });
            }
            await profile.update({
                ...(skills !== undefined && { skills }),
                ...(isAvailable !== undefined && { isAvailable }),
                ...(currentLocationId !== undefined && { currentLocationId }),
                ...(maxActiveJobs !== undefined && { maxActiveJobs }),
            });

            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Profile updated successfully',
                    data: profile,
                });
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
