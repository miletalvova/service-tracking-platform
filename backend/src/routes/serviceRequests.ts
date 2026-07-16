import { Router } from 'express';
const router = Router();
import type { Request, Response, NextFunction } from 'express';
import ServiceRequestService from '../services/serviceRequestService.js';
import { isAuth, isStaff, isTechnician } from '../middleware/auth.js';

router.get('/', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Service Requests']
    // #swagger.summary = 'Get all service requests'
    // #swagger.description = 'Endpoint to get all service requests'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.responses[200] = {
        description: 'List of service requests retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'List of service requests' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/ServiceRequest' } 
                            }
                        }
                    }
                }
            }
        }
    }*/
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    const status = (req.query.status as string) || 'all';

    try {
        const services = await ServiceRequestService.getAll(status);
        return res
            .status(200)
            .json({
                status: 'success',
                statusCode: 200,
                message: 'List of service requests',
                data: services,
            });
    } catch (err) {
        return next(err);
    }
});

router.get('/customer', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Service Requests']
    // #swagger.summary = 'Get all active customers service requests by Customer ID'
    // #swagger.description = 'Endpoint to get all active service requests by Cutomer ID'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.responses[200] = {
        description: 'Service requests retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Customer's Service Requests' },
                        data: { $ref: '#/components/schemas/ServiceRequest' }
                        }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const customerId = (req as any).user.id;

        const status = (req.query.status as string) || 'active';

        const requests = await ServiceRequestService.getCustomerRequests(customerId, status);

        if (requests.length === 0) {
            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'No active service requetsts',
                    data: [],
                });
        }

        return res
            .status(200)
            .json({
                status: 'success',
                statusCode: 200,
                message: "Customer's service requests details",
                data: requests,
            });
    } catch (err) {
        return next(err);
    }
});

router.get(
    '/:id',
    isAuth,
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        // #swagger.tags = ['Service Requests']
        // #swagger.summary = 'Get service request by ID'
        // #swagger.description = 'Endpoint to get details of a specific service request by its ID'
        // #swagger.produces = ['application/json']
        /* #swagger.security = [{ "JWT": [] }] */
        /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Service Request ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
        /* #swagger.responses[200] = {
        description: 'Details of a service request retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service Request details' },
                        data: { $ref: '#/components/schemas/ServiceRequest' }
                        }
                    }
                }
            }
        }
    } */
        /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
        /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
        /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
        /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

        try {
            const idNum = Number(req.params.id);

            if (Number.isNaN(idNum)) {
                return res
                    .status(400)
                    .json({
                        status: 'error',
                        statusCode: 400,
                        message: 'Service request ID must be a number',
                    });
            }

            const service = await ServiceRequestService.getOneById(idNum);
            if (!service) {
                return res
                    .status(404)
                    .json({
                        status: 'error',
                        statusCode: 404,
                        message: 'Service request not found',
                    });
            }
            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Service request details',
                    data: service,
                });
        } catch (err) {
            return next(err);
        }
    }
);

router.post('/', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Service Requests']
    // #swagger.summary = 'Creates a new service request'
    // #swagger.description = 'Endpoint to create a new service request'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/ServiceRequestInput' }
            }
        }
    } */
    /* #swagger.responses[201] = {
        description: 'Service Request created successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service Request created' },
                        data: { $ref: '#/components/schemas/ServiceRequest' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const { customerId, serviceId, locationId, description } = req.body;

        if (!customerId || !serviceId || !locationId || !description) {
            return res
                .status(400)
                .json({ status: 'error', statusCode: 400, message: 'Missing required fields' });
        }

        const service = await ServiceRequestService.create({
            customerId,
            serviceId,
            locationId,
            description,
        });
        return res
            .status(201)
            .json({
                status: 'success',
                statusCode: 201,
                message: 'Service request created successfully',
                data: service,
            });
    } catch (err) {
        return next(err);
    }
});

router.post('/smart', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Service Requests']
    // #swagger.summary = 'Creates a new service request'
    // #swagger.description = 'Endpoint to create a new service request'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/ServiceRequestInput' }
            }
        }
    } */
    /* #swagger.responses[201] = {
        description: 'Service Request created successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 201 },
                        message: { type: 'string', example: 'Service Request created' },
                        data: { $ref: '#/components/schemas/ServiceRequest' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const { description, location } = req.body;
        const customerId = (req as any).user.id;

        if (!description || !location) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Missing required fields',
            });
        }

        const service = await ServiceRequestService.createSmart({
            customerId,
            description,
            location,
        });

        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Service request created successfully',
            data: service,
        });
    } catch (err) {
        return next(err);
    }
});

router.put(
    '/:id',
    isAuth,
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        // #swagger.tags = ['Service Requests']
        // #swagger.summary = 'Updates a service request'
        // #swagger.description = 'Endpoint to update a service request'
        // #swagger.produces = ['application/json']
        // #swagger.consumes = ['application/json']
        /* #swagger.security = [{"JWT": [] }] */
        /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'ServiceRequest ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
        /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/ServiceRequestUpdateInput' }
            }
        }
    } */
        /* #swagger.responses[200] = {
        description: 'Service Request updated successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service Request updated' },
                        data: { $ref: '#/components/schemas/ServiceRequest' }
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
            const idNum = Number(req.params.id);

            if (Number.isNaN(idNum)) {
                return res
                    .status(400)
                    .json({
                        status: 'error',
                        statusCode: 400,
                        message: 'Service request ID must be a number',
                    });
            }
            const { customerId, serviceId, statusId, locationId } = req.body;

            if (customerId == null && serviceId == null && statusId == null && locationId == null) {
                return res
                    .status(400)
                    .json({
                        status: 'error',
                        statusCode: 400,
                        message: 'At least one field must be provided',
                    });
            }

            const updatedService = await ServiceRequestService.update(idNum, {
                customerId,
                serviceId,
                statusId,
                locationId,
            });
            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Service request updated successfully',
                    data: updatedService,
                });
        } catch (err) {
            return next(err);
        }
    }
);

router.delete(
    '/:id',
    isAuth,
    isStaff,
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        // #swagger.tags = ['Service Requests']
        // #swagger.summary = 'Delete a service request'
        // #swagger.description = 'Endpoint to delete a service request'
        // #swagger.produces = ['application/json']
        /* #swagger.security = [{"JWT": [] }] */
        /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Service Request ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
        /* #swagger.responses[200] = {
        description: 'Service request deleted successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service Request deleted' }
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
            const idNum = Number(req.params.id);

            if (Number.isNaN(idNum)) {
                return res
                    .status(400)
                    .json({
                        status: 'error',
                        statusCode: 400,
                        message: 'Service request ID must be a number',
                    });
            }

            await ServiceRequestService.delete(idNum);

            return res
                .status(200)
                .json({
                    status: 'success',
                    statusCode: 200,
                    message: 'Service request deleted successfully',
                });
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
