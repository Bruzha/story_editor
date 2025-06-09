import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { IdeaFactory } from '../models/Idea';
import { PlotLineFactory } from '../models/PlotLine';
import { CharacterFactory } from '../models/Character';
import { ProjectFactory } from '../models/Project';
import { getItemById } from '../controllers/commonController';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { GroupFactory } from '../models/Group';
import { ChapterFactory } from '../models/Chapter';
import { NoteFactory } from '../models/Note';
import { TimelineEventFactory } from '../models/TimelineEvent';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// Маршрут для получения данных о проекте
router.get('/projects/:projectId', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getItemById(req, res, next, 'projectId', 'Project', ProjectFactory, {
    typeSidebar: 'project',
    title: 'ДАННЫЕ ПРОЕКТА',
    showImageInput: true,
  });
});

// Маршрут для получения данных о идее
router.get('/ideas/:ideaId', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getItemById(req, res, next, 'ideaId', 'Idea', IdeaFactory, {
    typeSidebar: 'profile',
    title: 'ДАННЫЕ ИДЕИ',
    showImageInput: false,
  });
});

router.get(
  '/projects/:projectId/characters/:characterId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    const { typePage } = req.query;

    getItemById(
      req,
      res,
      next,
      'characterId',
      'Character',
      CharacterFactory,
      {
        typeSidebar: 'create_character',
        title: 'ДАННЫЕ ПЕРСОНАЖА',
        showImageInput: true,
        dataType: typePage as string,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о локации
router.get(
  '/projects/:projectId/locations/:locationId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'locationId',
      'Location',
      LocationFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ ЛОКАЦИИ',
        showImageInput: true,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных об объекте
router.get(
  '/projects/:projectId/objects/:objectId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'objectId',
      'Object',
      ObjectFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ ОБЪЕКТА',
        showImageInput: true,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о сюжетных линиях
router.get(
  '/projects/:projectId/plotlines/:plotlineId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'plotlineId',
      'Plotline',
      PlotLineFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ СЮЖЕТНОЙ ЛИНИИ',
        showImageInput: false,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о группах
router.get(
  '/projects/:projectId/groups/:groupId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'groupId',
      'Group',
      GroupFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ ГРУППЫ',
        showImageInput: false,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о главе
router.get(
  '/projects/:projectId/chapters/:chapterId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'chapterId',
      'Chapter',
      ChapterFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ ГЛАВЫ',
        showImageInput: true,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о заметке
router.get(
  '/projects/:projectId/notes/:noteId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'noteId',
      'Note',
      NoteFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ ЗАМЕТКИ',
        showImageInput: false,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о событии на линии времени
router.get(
  '/projects/:projectId/time_events/:timelineId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'timelineId',
      'TimelineEvent',
      TimelineEventFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ СОБЫТИЯ',
        showImageInput: true,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

// Маршрут для получения данных о событии на линии времени
router.get(
  '/projects/:projectId/timelines/:timelineId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'timelineId',
      'TimelineEvent',
      TimelineEventFactory,
      {
        typeSidebar: 'project',
        title: 'ДАННЫЕ СОБЫТИЯ',
        showImageInput: true,
      },
      'Project',
      ProjectFactory,
      'projectId'
    );
  }
);

export default router;
