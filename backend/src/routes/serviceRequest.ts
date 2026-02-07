import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Service request created" });
});

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "List of service requests" });
});

export default router;