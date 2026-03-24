import { Router } from "express";
const router = Router();
import type { NextFunction, Request, Response } from "express";
import ServiceService from "../services/serviceService.js";
import { isAuth, isStaff} from "../middleware/auth.js";


router.get("/", isAuth, async (req: Request, res: Response) => {
    const services = await ServiceService.getAll();
    res.json({ message: "List of services", data: services });
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response) => {
    const idNum = Number(req.params.id);

    if (Number.isNaN(idNum)) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Service ID must be a number" });
    }

    const service = await ServiceService.getOneById(idNum);
    if (!service) {
        return res.status(404).json({ status: "error", statuscode: 404, message: "Service not found" });
    }
    res.json({ message: "Service details", data: service });
});

router.post("/", isAuth, isStaff, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serviceType, description } = req.body;
    
    if (!serviceType || !description ) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields: serviceType, description" });
    }
    const newService = await ServiceService.create({ serviceType, description });

    res.status(201).json({ message: "Service created", data: newService });
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);
        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Service ID must be a number" });
        }
        const { serviceType, description } = req.body;
        if (!serviceType && !description) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "At least one field (serviceType or description) must be provided for update" });
        }
        const updatedService = await ServiceService.update(idNum, { serviceType, description });
        res.json({ message: "Service updated", data: updatedService });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);

        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Service ID must be a number" });
        }

        await ServiceService.delete(idNum);
        res.json({ message: "Service deleted" });
    } catch (err) {
        next(err);
    }
});

export default router;