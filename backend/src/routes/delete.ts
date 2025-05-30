import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { UserInstance } from '../models/User';
import { IdeaFactory } from '../models/Idea';
import { PlotLineFactory } from '../models/PlotLine';
import { CharacterFactory } from '../models/Character';
import { ProjectFactory } from '../models/Project';
import { deleteItem } from '../controllers/commonController';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { GroupFactory } from '../models/Group';
import { ChapterFactory } from '../models/Chapter';
import { NoteFactory } from '../models/Note';
import { TimelineEventFactory } from '../models/TimelineEvent';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: UserInstance;
}

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// Маршрут для удаления проекта
router.delete('/projects/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const projectId = req.query.projectId;
  deleteItem(req as AuthRequest, res, next, projectId, 'Project', ProjectFactory, 'userId');
});

// Маршрут для удаления персонажа
router.delete('/characters/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const characterId = req.query.characterId;
  deleteItem(req as AuthRequest, res, next, characterId, 'Character', CharacterFactory);
});

// Маршрут для удаления идеи
router.delete('/ideas/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const ideaId = req.query.ideaId;
  deleteItem(req as AuthRequest, res, next, ideaId, 'Idea', IdeaFactory, 'userId');
});

// Маршрут для удаления сюжетной линии
router.delete('/plotlines/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const plotlineId = req.query.plotlineId;
  deleteItem(req as AuthRequest, res, next, plotlineId, 'PlotLine', PlotLineFactory);
});
// Маршрут для удаления локации
router.delete('/locations/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const locationId = req.query.locationId;
  deleteItem(req as AuthRequest, res, next, locationId, 'Location', LocationFactory);
});
// Маршрут для удаления объекта
router.delete('/objects/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const objectId = req.query.objectId;
  deleteItem(req as AuthRequest, res, next, objectId, 'Object', ObjectFactory);
});
// Маршрут для удаления группы
router.delete('/groups/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const groupId = req.query.groupId;
  deleteItem(req as AuthRequest, res, next, groupId, 'Group', GroupFactory);
});
// Маршрут для удаления главы
router.delete('/chapters/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const chapterId = req.query.chapterId;
  deleteItem(req as AuthRequest, res, next, chapterId, 'Chapter', ChapterFactory);
});
// Маршрут для удаления заметки
router.delete('/notes/delete', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.query.noteId;
  deleteItem(req as AuthRequest, res, next, noteId, 'Note', NoteFactory);
});
// Маршрут для удаления события на линии времени
router.delete(
  '/time_events/delete',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    const timelineId = req.query.time_lineId;
    deleteItem(req as AuthRequest, res, next, timelineId, 'TimelineEvent', TimelineEventFactory);
  }
);

export default router;
