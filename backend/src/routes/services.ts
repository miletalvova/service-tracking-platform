import { Router } from "express";
const router = Router();
import type { Request, Response } from "express";
import ServiceService from "../services/serviceService.js";


router.get("/", async (req: Request, res: Response) => {
    const services = await ServiceService.getAll();
    res.json({ message: "List of services", data: services });
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
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

router.post("/", async (req: Request, res: Response) => {
    const { serviceType, description } = req.body;
    if (!serviceType || !description) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields" });
    }
    try {
    const service = await ServiceService.create({ serviceType, description });
    res.status(201).json({ message: "Service created successfully", data: service });
    } catch (error) {
       res.status(500).json({ status: "error", statuscode: 500, message: "Internal server error" });
    }
});

export default router;