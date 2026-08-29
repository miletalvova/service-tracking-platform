import { Router } from 'express';
const router = Router();
import type { Request, Response, NextFunction } from 'express';
import UserService from '../services/userService.js';
import { isAuth } from '../middleware/auth.js';

router.get('/customers', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customers = await UserService.getCustomers();
        res.status(200).json({status: 'success', statusCode: 200, data: customers })
    } catch (err) {
        return next(err);
    }
})



export default router;