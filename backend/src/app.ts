import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import type { Request, Response, NextFunction } from 'express';

import authRouter from './routes/auth.js';
import serviceRouter from './routes/services.js';
import serviceRequestRouter from './routes/serviceRequests.js';
import assignmentRouter from './routes/jobAssignments.js';
import technicianRouter from './routes/technicians.js';
import locationRouter from './routes/locations.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/services', serviceRouter);
app.use('/api/requests', serviceRequestRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/technicians', technicianRouter);
app.use('/api/locations', locationRouter);


// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {  
  next(createError(404));
});

// error handler
app.use(errorHandler);

export default app;