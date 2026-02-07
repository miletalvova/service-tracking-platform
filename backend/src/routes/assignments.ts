import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Assignments request created" });
});

export default router;