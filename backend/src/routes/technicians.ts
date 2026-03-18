import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import TechnicianService from "../services/technicianService.js";
import { isAuth, isTechnician } from "../middleware/auth.js";

router.post("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { technicianId } = req.body;
        const assignedRequests = await TechnicianService.getAssignedRequests(technicianId);
        res.json({ assignedRequests });
    } catch (error) {
        next(error);
    }
});

export default router;