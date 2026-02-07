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
            return res.status(401).json({ statuscode: 401, message: "Unathorized access: JWT token not provided" });
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            req.user = payload; 
            next();
        } catch (err) {
            return res.status(401).json({statuscode: 500, message: "Unathorized: token is invalid or expired"})
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
