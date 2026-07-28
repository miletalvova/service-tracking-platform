import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthJwtPayload } from '../types/jwt.js';

function extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return null;
    }
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
        return null;
    }
    return token;
}

export function isAuth(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);
    if (!token) {
        return res
            .status(401)
            .json({ statuscode: 401, message: 'Unauthorized access: JWT token not provided' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthJwtPayload;

        req.user = payload;
        next();
    } catch (_err) {
        return res
            .status(401)
            .json({ statuscode: 401, message: 'Unauthorized: token is invalid or expired' });
    }
}

export async function isStaff(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res
            .status(401)
            .json({
                statuscode: 401,
                message: 'Unauthorized access: user information not found in request',
            });
    }
    const payload = req.user as AuthJwtPayload;
    if (payload.role && payload.role !== 'Staff') {
        return res
            .status(403)
            .json({ statuscode: 403, message: 'Forbidden: Staff access required' });
    }
    next();
}

export async function isTechnician(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res
            .status(401)
            .json({
                statuscode: 401,
                message: 'Unauthorized access: user information not found in request',
            });
    }
    const payload = req.user as AuthJwtPayload;
    if (payload.role && payload.role !== 'Technician') {
        return res
            .status(403)
            .json({ statuscode: 403, message: 'Forbidden: Technician access required' });
    }
    next();
}

export async function isCustomer(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res
            .status(401)
            .json({
                statuscode: 401,
                message: 'Unauthorized access: user information not found in request',
            });
    }
    const payload = req.user as AuthJwtPayload;
    if (payload.role && payload.role !== 'Customer') {
        return res
            .status(403)
            .json({ statuscode: 403, message: 'Forbidden: Customer access required' });
    }
    next();
}
