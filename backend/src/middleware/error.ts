import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("FULL ERROR:", err);
    console.error("MESSAGE:", err.message);
    console.error("SQL MESSAGE:", (err as any)?.parent?.sqlMessage);
    
    res.status(500).json({ error: err.message || 'Internal Server Error' });
};
export default errorHandler;