import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import { isAuth, isStaff } from "../middleware/auth.js";
import locationService from "../services/locationService.js";

router.get("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Locations']
    // #swagger.summary = 'Get all locations'
    // #swagger.description = 'Endpoint to get all locations'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.responses[200] = {
        description: 'List of locations retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'List of locations' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Location' } 
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
        const locations = await locationService.getAll();
        return res.status(200).json({ status: "success", statusCode: 200, message: "List of locations", data: locations});
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Locations']
    // #swagger.summary = 'Get locations by ID'
    // #swagger.description = 'Endpoint to get details of a specific location by its ID'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Location ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.responses[200] = {
        description: 'Details of a location retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Locations details' },
                        data: { $ref: '#/components/schemas/Location' }
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

        if(Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "Location ID must be a number"})
        }

        const location = await locationService.getOneById(idNum);
        if(!location){
            return res.status(404).json({ status: "error", statusCode: 404, message: "Location not found"})
        }
        return res.status(200).json({ status: "success", statusCode: 200, message: "Location details", data: location});
    } catch (err) {
        return next(err);
    }
});

router.post("/", isAuth, isStaff, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Locations']
    // #swagger.summary = 'Creates a location'
    // #swagger.description = 'Endpoint to create a location'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/LocationInput' }
            }
        }
    } */
    /* #swagger.responses[201] = {
        description: 'location created successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 201 },
                        message: { type: 'string', example: 'Location created' },
                        data: { $ref: '#/components/schemas/Location' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unauthorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const { address, city, state, zipCode } = req.body;

        if(!address?.trim() || !city?.trim() || !state?.trim() || !zipCode?.trim()) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "Missing required fields: address, city, state, zipCode" });
        }

        const newLocation = await locationService.create({ address, city, state, zipCode });

        return res.status(201).json({ status: "success", statusCode: 201, message: "Location created", data: newLocation });
    } catch (err) {
       return next(err);
    }
});

router.put("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Locations']
    // #swagger.summary = 'Updates a location'
    // #swagger.description = 'Endpoint to update a location'
    // #swagger.produces = ['application/json']
    // #swagger.consumes = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Location ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/LocationUpdateInput' }
            }
        }
    } */
    /* #swagger.responses[200] = {
        description: 'Location updated successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Location updated' },
                        data: { $ref: '#/components/schemas/Location' }
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
            return res.status(400).json({ status: "error", statusCode: 400, message: "Location ID must be a number" });
        }

        const { address, city, state, zipCode } = req.body;

        if (!address && !city && !state && !zipCode) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "At least one field (address, city, state, zipCode) must be provided for update" });
        }

        const updatedLocation = await locationService.update(idNum, { address, city, state, zipCode });

        return res.status(200).json({ status: "success", statusCode: 200, message: "Location updated", data: updatedLocation });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Locations']
    // #swagger.summary = 'Delete a location'
    // #swagger.description = 'Endpoint to delete a location'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Location ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.responses[200] = {
        description: 'Location deleted successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Location deleted' }
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
            return res.status(400).json({ status: "error", statusCode: 400, message: "Location ID must be a number" });
        }

        await locationService.delete(idNum);

        return res.status(200).json({ status: "success", statusCode: 200, message: "Location deleted" });
    } catch (err) {
        return next(err);
    }
});

export default router;
