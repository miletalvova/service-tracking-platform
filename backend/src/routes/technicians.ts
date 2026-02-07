import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";

router.post("/jobs", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Jobs request created" });
});

export default router;