import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import { isAuth, isStaff } from "../middleware/auth.js";
import jobAssignmentService from "../services/jobAssignmentService.js";

router.get("/", isAuth, async (req: Request, res: Response) => {
    const assignments = await jobAssignmentService.getAll();
    res.json({ message: "List of assignments", data: assignments})
});

router.get("/:id", isAuth, async (req: Request<{ id: string }>, res: Response) => {
    const idNum = Number(req.params.id);

    if(Number.isNaN(idNum)) {
        return res.status(400).json({ status: "error", statuscode: 400, message: "Job Assignment ID must be a number"})
    }

    const jobAssignment = await jobAssignmentService.getOneById(idNum);
    if(!jobAssignment){
        return res.status(404).json({ status: "error", statuscode: 404, message: "Job Assignment not found"})
    }
    res.json({ message: "Job Assignment details", data: jobAssignment});
});

router.post("/", isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serviceRequestId, technicianId } = req.body;

        if(!serviceRequestId || !technicianId) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Missing required fields: serviceRequestId, technicianId" });
        }
        const newAssignment = await jobAssignmentService.create({ serviceRequestId, technicianId});
        res.status(201).json({ message: "Job Assignment created", data: newAssignment });
    } catch (err) {
        next(err);
    }
});

router.put("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);
        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Job Assignment ID must be a number" });
        }
        const { serviceRequestId, technicianId } = req.body;
        if (!serviceRequestId && !technicianId) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "At least one field (serviceRequestId or technicianId) must be provided for update" });
        }
        const updatedAssignment = await jobAssignmentService.update(idNum, { serviceRequestId, technicianId });
        res.json({ message: "Service updated", data: updatedAssignment });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", isAuth, isStaff, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const idNum = Number(req.params.id);

        if (Number.isNaN(idNum)) {
            return res.status(400).json({ status: "error", statuscode: 400, message: "Job Assignment ID must be a number" });
        }

        await jobAssignmentService.delete(idNum);
        res.json({ message: "Job Assignment deleted" });
    } catch (err) {
        next(err);
    }
});

export default router;