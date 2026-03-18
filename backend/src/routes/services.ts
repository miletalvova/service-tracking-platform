import { Router } from "express";
const router = Router();
import type { Request, Response } from "express";
import ServiceService from "../services/serviceService.js";
import { isAuth } from "../middleware/auth.js";


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

export default router;