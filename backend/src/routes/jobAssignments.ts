import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import { isAuth, isStaff } from "../middleware/auth.js";
import jobAssignmentService from "../services/jobAssignmentService.js";

router.get("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Job Assignments']
    // #swagger.summary = 'Get all job assignments'
    // #swagger.description = 'Endpoint to get all job assignments'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.responses[200] = {
        description: 'List of job assignments retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'List of assignments' },
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/JobAssignment' } 
                            }
                        }
                    }
                }
            }
        }
    }*/
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unathorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const assignments = await jobAssignmentService.getAll();
        return res.status(200).json({ status: "success", statusCode: 200, message: "List of assignments", data: assignments });
    } catch (err) {
        return next(err);
    }
});

router.get("/recommend/:serviceRequestId", isAuth, async (req: Request<{ serviceRequestId: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Job Assignments']
    // #swagger.summary = 'Recommend a technician for a service request'
    // #swagger.description = 'Endpoint to recommend the best available technician for a given service request ID'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.parameters['serviceRequestId'] = {
        in: 'path',
        description: 'ID of the service request to get a technician recommendation for',
        required: true,
        schema: { type: 'number', example: 101 }
    } */
    /* #swagger.responses[200] = {
        description: 'Recommended technician retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Recommended assignment' },
                        data: { $ref: '#/components/schemas/JobAssignment' }
                        }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unathorized' } */
    /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {    
        const serviceRequestId = Number(req.params.serviceRequestId);

        if (Number.isNaN(serviceRequestId)) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "serviceRequestId must be a number" });
        }

        const recommendedAssignment = await jobAssignmentService.recommendTechnician(serviceRequestId);

        if(!recommendedAssignment) {
            return res.status(404).json({ status: "error", statusCode: 404, message: "No techinician recommended found" })
        }

        return res.status(200).json({ status: "success", statusCode: 200, message: "Recommended assignment", data: recommendedAssignment });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Job Assignments']
    // #swagger.summary = 'Get job assignment by ID'
    // #swagger.description = 'Endpoint to get details of a specific job assignment by its ID'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Job Assignment ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.responses[200] = {
        description: 'Details of a job assignment retrieved successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Job Assignment details' },
                        data: { $ref: '#/components/schemas/JobAssignment' }
                        }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unathorized' } */
    /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const idNum = Number(req.params.id);

        if(Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "Job Assignment ID must be a number"})
        }

        const jobAssignment = await jobAssignmentService.getOneById(idNum);

        if(!jobAssignment){
            return res.status(404).json({ status: "error", statusCode: 404, message: "Job Assignment not found"})
        }

        return res.status(200).json({ status: "success", statusCode:200, message: "Job Assignment details", data: jobAssignment});
        } catch (err) {
            return next(err);
        }
});

router.post("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Job Assignments']
    // #swagger.summary = 'Creates a new job assignment'
    // #swagger.description = 'Endpoint to create a new job assignment'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{ "JWT": [] }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/JobAssignmentInput' }
            }
        }
    } */
    /* #swagger.responses[201] = {
        description: 'JobAssignnment created successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Job Assignment created' },
                        data: { $ref: '#/components/schemas/JobAssignment' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unathorized' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */
    

    try {
        const { serviceRequestId, technicianId } = req.body;

        if (serviceRequestId == null || technicianId == null) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "serviceRequestId and technicianId are required" });
        }

        const newAssignment = await jobAssignmentService.create({ serviceRequestId, technicianId});

        return res.status(201).json({ status: "success", statusCode: 201, message: "Job Assignment created", data: newAssignment });
    } catch (err) {
        return next(err);
    }
});

router.put("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Job Assignments']
    // #swagger.summary = 'Updates a job assignment'
    // #swagger.description = 'Endpoint to update a job assignment'
    // #swagger.produces = ['application/json']
    // #swagger.consumes = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'JobAssignment ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: '#/components/schemas/JobAssignmentUpdateInput' }
            }
        }
    } */
    /* #swagger.responses[200] = {
        description: 'Job Assignment updated successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Job Assignment updated' },
                        data: { $ref: '#/components/schemas/JobAssignment' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unathorized' } */
    /* #swagger.responses[403] = { $ref: '#/components/responses/Forbidden' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */

    try {
        const idNum = Number(req.params.id);

        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "Job Assignment ID must be a number" });
        }

        const { serviceRequestId, technicianId } = req.body;

        if (serviceRequestId == null && technicianId == null) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "At least one field (serviceRequestId or technicianId) must be provided for update" });
        }

        const updatedAssignment = await jobAssignmentService.update(idNum, { serviceRequestId, technicianId });

        res.status(200).json({ status: "success", statusCode: 200, message: "Job Assignment updated", data: updatedAssignment });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    // #swagger.tags = ['Job Assignments']
    // #swagger.summary = 'Delete a job assignment'
    // #swagger.description = 'Endpoint to delete a job assignment'
    // #swagger.produces = ['application/json']
    /* #swagger.security = [{"JWT": [] }] */
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Job assignment ID',
        required: true,
        schema: { type: 'integer', example: 1 }
    } */
    /* #swagger.responses[200] = {
        description: 'Job Assignment deleted successfully',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'success' },
                        statusCode: { type: 'number', example: 200 },
                        message: { type: 'string', example: 'Job Assignment updated' }
                    }
                }
            }
        }
    } */
    /* #swagger.responses[400] = { $ref: '#/components/responses/BadRequest' } */
    /* #swagger.responses[401] = { $ref: '#/components/responses/Unathorized' } */
    /* #swagger.responses[403] = { $ref: '#/components/responses/Forbidden' } */
    /* #swagger.responses[404] = { $ref: '#/components/responses/NotFound' } */
    /* #swagger.responses[500] = { $ref: '#/components/responses/InternalServerError' } */
    try {
        const idNum = Number(req.params.id);

        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statusCode: 400, message: "Job Assignment ID must be a number" });
        }

        const existingAssignment = await jobAssignmentService.getOneById(idNum);

        if(!existingAssignment) {
            return res.status(404).json({ status: "error", statusCode: 404, message: "Job Assignment not found"
            })
        }

        await jobAssignmentService.delete(idNum);

        return res.status(200).json({ status: "success", statusCode: 200, message: "Job Assignment deleted" });
    } catch (err) {
        return next(err);
    }
});

export default router;