import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import type { Request, Response, NextFunction } from 'express';

import authRouter from './routes/auth.js';
import serviceRouter from './routes/services.js';
import assignmentRouter from './routes/assignments.js';
import technicianRouter from './routes/technicians.js';
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
app.use('/api/assignments', assignmentRouter);
app.use('/api/technicians', technicianRouter);


// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {  
  next(createError(404));
});

// error handler
app.use(errorHandler);

export default app;