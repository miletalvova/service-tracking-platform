import { Router } from "express";
const router = Router();
import type { NextFunction, Request, Response } from "express";
import ServiceService from "../services/serviceService.js";
import { isAuth, isStaff, isCustomer} from "../middleware/auth.js";


router.get("/", isAuth, isCustomer, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Services']
    // #swagger.summary = 'Get all services'
    // #swagger.description = 'Endpoint to get all services'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.responses[200] = {
        description: 'List of services retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'List of services' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Service' } 
                            }
                        }
                    }
                }
            }
        }
    }*/
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const services = await ServiceService.getAll();
        return res.status(200).json({ status: "success", statusCode: 200, message: "List of services", data: services });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Services']
    // #swagger.summary = 'Get service by ID'
    // #swagger.description = 'Endpoint to get details of a specific service by its ID'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Service ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.responses[200] = {
        description: 'Details of a service retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service details' },
                        data: { $ref: '#/components/schemas/Service' }
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
            return res.status(400).json({ status: "error", statusCode: 400, message: "Service ID must be a number" });
        }

        const service = await ServiceService.getOneById(idNum);
        if (!service) {
            return res.status(404).json({ status: "error", statusCode: 404, message: "Service not found" });
        }
        return res.status(200).json({ status: "success", statusCode:200, message: "Service details", data: service });
    } catch (err) {
        return next(err);
    }
});

router.post("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Services']
    // #swagger.summary = 'Creates a new service'
    // #swagger.description = 'Endpoint to create a new service'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/ServiceInput' }
            }
        }
    } */
    /* #swagger.responses[201] = {
        description: 'Service created successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 201 },
                        message: { type: 'string', example: 'Service created' },
                        data: { $ref: '#/components/schemas/Service' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const { specialization, description } = req.body;
    
        if (!specialization || !description ) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "Missing required fields: specialization, description" });
        }
        const newService = await ServiceService.create({ specialization, description });

        return res.status(201).json({ status: "success", statusCode: 201, message: "Service created", data: newService });
    } catch (err) {
        return next(err);
    }
});

router.put("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Services']
    // #swagger.summary = 'Updates a service'
    // #swagger.description = 'Endpoint to update a service'
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
                schema: { $ref: '#/components/schemas/ServiceUpdateInput' }
            }
        }
    } */
    /* #swagger.responses[200] = {
        description: 'Service updated successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service updated' },
                        data: { $ref: '#/components/schemas/Service' }
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
            return res.status(400).json({ status: "error", statusCode: 400, message: "Service ID must be a number" });
        }

        const { specialization, description } = req.body;

        if (specialization == null && description == null) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "At least one field (specialization or description) must be provided for update" });
        }

        const updatedService = await ServiceService.update(idNum, { specialization, description });
        return res.status(200).json({ status: "success", statusCode: 200, message: "Service updated", data: updatedService });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Services']
    // #swagger.summary = 'Delete a service'
    // #swagger.description = 'Endpoint to delete a service'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Service ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.responses[200] = {
        description: 'Service deleted successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Service deleted' }
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
            return res.status(400).json({ status: "error", statusCode: 400, message: "Service ID must be a number" });
        }

        await ServiceService.delete(idNum);

        return res.status(200).json({ status: "success", statusCode: 200, message: "Service deleted" });
    } catch (err) {
        return next(err);
    }
});

export default router;