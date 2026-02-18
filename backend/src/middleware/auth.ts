import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

export function isAuth(req: Request, res: Response, next: NextFunction) {
        const token = extractToken(req);
        if(!token) {
            return res.status(401).json({ statuscode: 401, message: "Unauthorized access: JWT token not provided" });
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            req.user = payload; 
            next();
        } catch (err) {
            return res.status(401).json({statuscode: 401, message: "Unauthorized: token is invalid or expired"})
        }
    }

function extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return null;
    }
    const [scheme, token] = authHeader.split(" ");
    if(scheme !== "Bearer" || !token) {
        return null;
    }
    return token;
}

export async function isStaff(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json({ statuscode: 401, message: "Unauthorized access: JWT token not provided" });
    }
    const payload = req.user as JwtPayload;

    if(payload.role && payload.role !== "Staff") {
        return res.status(403).json({ statuscode: 403, message: "Forbidden: Staff access required" });
    }
    next();
}

export async function isTechnician(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json({ statuscode: 401, message: "Unauthorized access: JWT token not provided" });
    }
    const payload = req.user as JwtPayload;

    if(payload.role && payload.role !== "Technician") {
        return res.status(403).json({ statuscode: 403, message: "Forbidden: Technician access required" });
    }
    next();
}

export async function isCustomer(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json({ statuscode: 401, message: "Unauthorized access: JWT token not provided" });
    }
    const payload = req.user as JwtPayload;

    if(payload.role && payload.role !== "Customer") {
        return res.status(403).json({ statuscode: 403, message: "Forbidden: Customer access required" });
    }
    next();
}
