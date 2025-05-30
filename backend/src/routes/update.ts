import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { ProjectFactory } from '../models/Project';
import { updateItem } from '../controllers/commonController';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

router.patch(
  '/update/projects/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`Начало обновления проекта с ID: ${req.params.id}`);
    updateItem(req, res, next, 'Project', ProjectFactory).catch(next);
    console.log(`Конец обновления проекта с ID: ${req.params.id}`);
  }
);

export default router;
