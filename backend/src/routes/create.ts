import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { IdeaFactory } from '../models/Idea';
import { ProjectFactory } from '../models/Project';
import { createItem } from '../controllers/commonController';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import createPageData from '../data/createPageData';
import { CharacterFactory } from '../models/Character';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { ChapterFactory } from '../models/Chapter';
import { GroupFactory } from '../models/Group';
import { NoteFactory } from '../models/Note';
import { PlotLineFactory } from '../models/PlotLine';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

router.get('/create/create-page-data/:type', protect as ProtectMiddleware, (req: Request, res: Response) => {
  const { type } = req.params;
  const { typePage } = req.query; // Получаем typePage из query

  console.log('Type create-page: ' + type, 'Type page:', typePage);

  let pageData;

  if (type === 'characters' && typePage) {
    pageData = createPageData.find((item) => item.type === type && item.typePage === typePage);
  } else {
    pageData = createPageData.find((item) => item.type === type);
  }

  if (pageData) {
    res.status(200).json(pageData);
  } else {
    res.status(404).json({ message: 'Create page data not found' });
  }
});

router.post('/create_item/projects', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Project', ProjectFactory).catch(next);
});
router.post('/create_item/ideas', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Idea', IdeaFactory).catch(next);
});
router.post('/create_item/locations', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Location', LocationFactory).catch(next);
});
router.post('/create_item/objects', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Object', ObjectFactory).catch(next);
});
router.post('/create_item/characters', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Character', CharacterFactory).catch(next);
});
router.post('/create_item/time_events', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'TimelineEvent', TimelineEventFactory).catch(next);
});
router.post('/create_item/chapters', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Chapter', ChapterFactory).catch(next);
});
router.post('/create_item/groups', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Group', GroupFactory).catch(next);
});
router.post('/create_item/notes', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Note', NoteFactory).catch(next);
});
router.post('/create_item/plotlines', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'PlotLine', PlotLineFactory).catch(next);
});

export default router;
