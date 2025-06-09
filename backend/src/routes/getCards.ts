import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { IdeaFactory } from '../models/Idea';
import { PlotLineFactory } from '../models/PlotLine';
import { CharacterFactory } from '../models/Character';
import { ProjectFactory } from '../models/Project';
import { getItems } from '../controllers/commonController';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { GroupFactory } from '../models/Group';
import { ChapterFactory } from '../models/Chapter';
import { NoteFactory } from '../models/Note';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { SupportingMaterialFactory, enum_supportingmaterials_type } from '../models/SupportingMaterial';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

//Маршрут для получения проектов
router.get('/projects', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getItems(req, res, next, {
    modelName: 'Project',
    modelFactory: ProjectFactory,
    title: 'ПРОЕКТЫ',
    subtitleSource: 'user',
    typeSidebar: 'profile',
    typeCard: 'project',
    createPageUrl: '/projects/create',
    infoFields: [
      { fieldName: 'name', optional: true, defaultValue: 'Проект' },
      { fieldName: 'annotation', optional: true, defaultValue: '' },
      { fieldName: 'genre', optional: true, defaultValue: '' },
    ],
    otherFields: [
      { fieldName: 'createdAt', format: (date) => new Date(date).toLocaleString() },
      { fieldName: 'status' },
    ],
    src: true,
    userIdField: 'userId',
  });
});

//Маршрут для получения идей
router.get('/ideas', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getItems(req, res, next, {
    modelName: 'Idea',
    modelFactory: IdeaFactory,
    title: 'ИДЕИ',
    subtitleSource: 'user',
    typeSidebar: 'profile',
    typeCard: 'idea',
    createPageUrl: '/ideas/create',
    infoFields: [
      { fieldName: 'name', optional: true, defaultValue: 'Идея' },
      { fieldName: 'description', optional: true, defaultValue: '' },
    ],
    otherFields: [{ fieldName: 'createdAt', format: (date) => new Date(date).toLocaleString() }],
    userIdField: 'userId',
  });
});

//Маршрут для получения сюжетных линий
router.get(
  '/projects/:projectId/plotlines',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Plotline',
      modelFactory: PlotLineFactory,
      title: 'СЮЖЕТНЫЕ ЛИНИИ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'plotline',
      createPageUrl: '/plotlines/create',
      infoFields: [
        { fieldName: 'name', optional: true, defaultValue: '' },
        { fieldName: 'description', optional: true, defaultValue: '' },
      ],
      otherFields: [{ fieldName: 'type' }],
      projectIdRequired: true,
    });
  }
);
//Маршрут для получения персонажей
router.get(
  '/projects/:projectId/characters',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Character',
      modelFactory: CharacterFactory,
      title: 'ПЕРСОНАЖИ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'character',
      createPageUrl: '/characters/create?typePage=characters',
      infoFields: [
        { fieldName: 'name', optional: true, defaultValue: '' },
        { fieldName: 'description', optional: true, defaultValue: '' },
        { fieldName: 'role', optional: true, defaultValue: '' },
        { fieldName: 'gender', optional: true, defaultValue: '' },
        { fieldName: 'age', optional: true, defaultValue: '' },
        { fieldName: 'race', optional: true, defaultValue: '' },
      ],
      projectIdRequired: true,
      src: true,
    });
  }
);

//Маршрут для получения локаций
router.get(
  '/projects/:projectId/locations',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Location',
      modelFactory: LocationFactory,
      title: 'ЛОКАЦИИ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'location',
      createPageUrl: '/locations/create',
      infoFields: [
        { fieldName: 'name', optional: true, defaultValue: '' },
        { fieldName: 'description', optional: true, defaultValue: '' },
        { fieldName: 'type', optional: true, defaultValue: '' },
      ],
      projectIdRequired: true,
      src: true,
    });
  }
);

//Маршрут для получения объектов
router.get(
  '/projects/:projectId/objects',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Object',
      modelFactory: ObjectFactory,
      title: 'ОБЪЕКТЫ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'object',
      createPageUrl: '/objects/create',
      infoFields: [
        { fieldName: 'name', optional: true, defaultValue: '' },
        { fieldName: 'description', optional: true, defaultValue: '' },
        { fieldName: 'type', optional: true, defaultValue: '' },
      ],
      projectIdRequired: true,
      src: true,
    });
  }
);

//Маршрут для получения групп
router.get(
  '/projects/:projectId/groups',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Group',
      modelFactory: GroupFactory,
      title: 'ГРУППЫ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'group',
      createPageUrl: '/groups/create',
      infoFields: [
        { fieldName: 'name', optional: true, defaultValue: '' },
        { fieldName: 'description', optional: true, defaultValue: '' },
      ],
      projectIdRequired: true,
    });
  }
);

//Маршрут для получения глав
router.get(
  '/projects/:projectId/chapters',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Chapter',
      modelFactory: ChapterFactory,
      title: 'ГЛАВЫ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'chapter',
      createPageUrl: '/chapters/create',
      infoFields: [
        { fieldName: 'title', optional: true, defaultValue: '' },
        { fieldName: 'description', optional: true, defaultValue: '' },
        { fieldName: 'order', optional: true, defaultValue: '' },
      ],
      otherFields: [{ fieldName: 'status' }],
      projectIdRequired: true,
      src: true,
    });
  }
);

//Маршрут для получения заметок
router.get(
  '/projects/:projectId/notes',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'Note',
      modelFactory: NoteFactory,
      title: 'ЗАМЕТКИ',
      subtitleSource: 'project',
      typeSidebar: 'project',
      typeCard: 'note',
      createPageUrl: '/notes/create',
      infoFields: [
        { fieldName: 'title', optional: true, defaultValue: '' },
        { fieldName: 'content', optional: true, defaultValue: '' },
      ],
      projectIdRequired: true,
    });
  }
);

//Маршрут для получения событий линии времени
router.get(
  '/projects/:projectId/time_events',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'TimelineEvent',
      modelFactory: TimelineEventFactory,
      title: 'СОБЫТИЯ ЛИНИИ ВРЕМЕНИ',
      subtitleSource: 'project',
      typeSidebar: 'timeline',
      typeCard: 'timeline',
      createPageUrl: '/time_events/create',
      infoFields: [
        { fieldName: 'name', optional: true, defaultValue: '' },
        { fieldName: '', optional: true, defaultValue: '' },
      ],
      otherFields: [{ fieldName: 'eventDate', format: (date) => new Date(date).toLocaleString() }],
      projectIdRequired: true,
      src: true,
    });
  }
);

// Маршрут для получения советов
router.get(
  '/projects/:projectId/advices',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'SupportingMaterial',
      modelFactory: SupportingMaterialFactory,
      title: 'СОВЕТЫ',
      subtitleSource: 'project',
      typeSidebar: 'help',
      typeCard: 'advice',
      createPageUrl: '/supporting_materials/create',
      otherFields: [{ fieldName: 'title' }, { fieldName: 'content' }],
      where: { type: enum_supportingmaterials_type.ADVICE },
    });
  }
);

// Маршрут для получения терминов
router.get(
  '/projects/:projectId/terms',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItems(req, res, next, {
      modelName: 'SupportingMaterial',
      modelFactory: SupportingMaterialFactory,
      title: 'ТЕРМИНЫ',
      subtitleSource: 'project',
      typeSidebar: 'help',
      typeCard: 'term',
      createPageUrl: '/supporting_materials/create',
      otherFields: [{ fieldName: 'title' }, { fieldName: 'content' }],
      where: { type: enum_supportingmaterials_type.ADVICE },
    });
  }
);

export default router;
