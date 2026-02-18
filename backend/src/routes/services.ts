import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import ServiceRequestService from "../services/serviceRequestService.js";


router.get("/", async (req: Request, res: Response) => {
    const services = await ServiceRequestService.getAll();
    res.json({ message: "List of service requests", data: services });
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    const idNum = Number(req.params.id);

    if (Number.isNaN(idNum)) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Service request ID must be a number" });
    }

    const service = await ServiceRequestService.getOneById(idNum);
    if (!service) {
        return res.status(404).json({ status: "error", statuscode: 404, message: "Service request not found" });
    }
    res.json({ message: "Service request details", data: service });
});

router.post("/", async (req: Request, res: Response) => {
    const { customerId, serviceId, statusId, locationId } = req.body;
    if (!customerId || !serviceId || !statusId || !locationId) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields" });
    }
    try {
    const service = await ServiceRequestService.create({ customerId, serviceId, statusId, locationId });
    res.status(201).json({ message: "Service request created successfully", data: service });
    } catch (error) {
       res.status(500).json({ status: "error", statuscode: 500, message: "Internal server error" });
    }
});

export default router;