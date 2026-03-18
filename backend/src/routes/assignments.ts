import { Router } from "express";
const router = Router();
import type { Request, Response, NextFunction } from "express";
import { isAuth } from "../middleware/auth.js";

router.post("/", isAuth, (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Assignments request created" });
});

export default router;