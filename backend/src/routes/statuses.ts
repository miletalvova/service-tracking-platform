import { Router } from 'express';
const router = Router();
import type { Request, Response, NextFunction } from 'express';
import StatusService from '../services/statusService.js';
import { isAuth } from '../middleware/auth.js';

router.get('/', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const statuses = await StatusService.getAllStatuses();
        res.status(200).json({ status: 'success', statusCode: 200, data: statuses });
    } catch (err) {
        return next(err);
    }
});

export default router;
