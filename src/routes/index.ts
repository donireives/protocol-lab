import { Router } from 'express';
import productRouter from './productRoutes';

const apiRouter = Router();

apiRouter.use('/demo', productRouter);

export default apiRouter;
