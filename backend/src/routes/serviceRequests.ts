import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import ServiceRequestService from "../services/serviceRequestService.js";
import { isAuth, isStaff, isTechnician } from "../middleware/auth.js";


router.get("/", isAuth, async (req: Request, res: Response) => {
    const services = await ServiceRequestService.getAll();
    res.json({ message: "List of service requests", data: services });
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response) => {
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

router.post("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { customerId, serviceId, statusId, locationId } = req.body;
    if (!customerId || !serviceId || !statusId || !locationId) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields" });
    }
    try {
    const service = await ServiceRequestService.create({ customerId, serviceId, statusId, locationId });
    res.status(201).json({ message: "Service request created successfully", data: service });
    } catch (err) {
       next(err);
    }
});

router.put("/:id", isAuth, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const idNum = Number(req.params.id);
    if (Number.isNaN(idNum)) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Service request ID must be a number" });
    }
    const { customerId, serviceId, statusId, locationId } = req.body;
    if (!customerId || !serviceId || !statusId || !locationId) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields" });
    }
    try {
        const service = await ServiceRequestService.getOneById(idNum);
        if (!service) {
            return res.status(404).json({ status: "error", statuscode: 404, message: "Service request not found" });
        }
        const updatedService = await ServiceRequestService.update(idNum, { customerId, serviceId, statusId, locationId });
        res.json({ message: "Service request updated successfully", data: updatedService });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);
        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Service request ID must be a number" });
        }
        const service = await ServiceRequestService.getOneById(idNum);
        if (!service) {
            return res.status(404).json({ status: "error", statuscode: 404, message: "Service request not found" });
        }
        await ServiceRequestService.delete(idNum);
        res.json({ message: "Service request deleted successfully" });
    } catch (err) {
        next(err);
    }
});


export default router;