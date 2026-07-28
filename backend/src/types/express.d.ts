import type { AuthJwtPayload } from './jwt.js';

declare global {
    namespace Express {
        interface Request {
            user?: AuthJwtPayload;
        }
    }
}

export {};