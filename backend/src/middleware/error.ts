import type { Request, Response, NextFunction } from 'express';
import type { HttpError } from "http-errors";

export const errorHandler = (err: Error | HttpError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = "status" in err ? err.status : 500;

    console.error("FULL ERROR:", err);
    console.error("MESSAGE:", err.message);
    console.error("SQL MESSAGE:", (err as any)?.parent?.sqlMessage);
    
    res.status(statusCode || 500).json({
        status: "error",
        statusCode: statusCode || 500,
        message: err.message || "Internal Server Error" 
    });
};
export default errorHandler;