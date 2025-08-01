import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { ProjectFactory } from '../models/Project';
import { updateItem } from '../controllers/commonController';
import { ObjectFactory } from '../models/Object';
import { GroupFactory } from '../models/Group';
import { ChapterFactory } from '../models/Chapter';
import { IdeaFactory } from '../models/Idea';
import { LocationFactory } from '../models/Location';
import { NoteFactory } from '../models/Note';
import { PlotLineFactory } from '../models/PlotLine';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { CharacterFactory } from '../models/Character';
import { SupportingMaterialFactory } from '../models/SupportingMaterial';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

router.patch(
  '/update/projects/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'Project', ProjectFactory).catch(next);
  }
);

router.patch('/update/objects/:id', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateItem(req, res, next, 'Object', ObjectFactory).catch(next);
});

router.patch('/update/advices/:id', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateItem(req, res, next, 'SupportingMaterial', SupportingMaterialFactory).catch(next);
});
router.patch('/update/terms/:id', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateItem(req, res, next, 'SupportingMaterial', SupportingMaterialFactory).catch(next);
});

router.patch('/update/groups/:id', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateItem(req, res, next, 'Group', GroupFactory).catch(next);
});

router.patch(
  '/update/chapters/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'Chapter', ChapterFactory).catch(next);
  }
);

router.patch('/update/ideas/:id', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateItem(req, res, next, 'Idea', IdeaFactory).catch(next);
});

router.patch(
  '/update/locations/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'Location', LocationFactory).catch(next);
  }
);

router.patch('/update/notes/:id', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateItem(req, res, next, 'Note', NoteFactory).catch(next);
});

router.patch(
  '/update/plotlines/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'PlotLine', PlotLineFactory).catch(next);
  }
);

router.patch(
  '/update/time_events/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'TimelineEvents', TimelineEventFactory).catch(next);
  }
);
router.patch(
  '/update/timelines/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'TimelineEvents', TimelineEventFactory).catch(next);
  }
);

router.patch(
  '/update/characters/:id',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    updateItem(req, res, next, 'Character', CharacterFactory).catch(next);
  }
);

export default router;
