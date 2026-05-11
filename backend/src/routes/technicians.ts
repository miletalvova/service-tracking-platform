import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import TechnicianService from "../services/technicianService.js";
import { isAuth, isTechnician } from "../middleware/auth.js";
import jobAssignmentService from "../services/jobAssignmentService.js";

router.get("/assigned-requests", isAuth, isTechnician, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { technicianId } = req.query;
        const assignedRequests = await TechnicianService.getAssignedRequests(Number(technicianId));
        res.json({ assignedRequests});
    } catch (error) {
        next(error);
    }
});

router.patch("/:id/status", isAuth, isTechnician, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const serviceRequestId = Number(req.params.id);
        const technicianId = (req as any).user.id;
        const { statusId } = req.body;

        if(!statusId) {
            return res.status(400).json({ error: "statusId is required" });
        }

        await TechnicianService.updateStatus(serviceRequestId, statusId, technicianId);

        if (statusId === 4 || statusId === 5) {
            await jobAssignmentService.unassign(serviceRequestId);
        }
        res.json({ message: "Status updated successfully" });
    } catch (error) {
        next(error);
    }
});

router.patch("/profile", isAuth, isTechnician, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { skills, isAvailable, currentLocationId, maxActiveJobs } = req.body;

        const profile = await TechnicianService.getOneByUserId(userId);
        if (!profile) {
            return res.status(404).json({ error: "Technician profile not found" });
        }
        await profile.update({ 
            ...(skills !== undefined && { skills }), 
            ...(isAvailable !== undefined && { isAvailable }), 
            ...(currentLocationId !== undefined && { currentLocationId }), 
            ...(maxActiveJobs !== undefined && { maxActiveJobs })
        });

        res.json({ message: "Profile updated successfully", data: profile });
    } catch (error) {
        next(error);
    }
});

export default router;