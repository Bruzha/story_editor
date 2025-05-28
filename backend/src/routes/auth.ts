import express, { Router, Request, Response, NextFunction } from 'express';
import { register, login, reset_password, check_email, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { UserInstance } from '../models/User';
import { IdeaFactory } from '../models/Idea';
import { PlotLineFactory } from '../models/PlotLine';
import { CharacterFactory } from '../models/Character';
import { ProjectFactory } from '../models/Project';
import { deleteItem, getItemById, getItems } from '../controllers/commonController';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { GroupFactory } from '../models/Group';
import { ChapterFactory } from '../models/Chapter';
import { NoteFactory } from '../models/Note';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { SupportingMaterialFactory, enum_supportingmaterials_type } from '../models/SupportingMaterial';
import createPageData from '../data/createPageData';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: UserInstance;
}

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

//Маршрут для регистрации
router.post('/register', async (req: Request, res: Response) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Registration failed');
  }
});

//Маршрут для авторизации
router.post('/login', async (req: Request, res: Response) => {
  try {
    await login(req, res);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

//Маршрут для смены пароля
router.put('/reset-password', async (req: Request, res: Response) => {
  try {
    await reset_password(req, res);
  } catch (error) {
    console.error('Error during reset-password:', error);
    res.status(500).send('Reset-password failed');
  }
});

//Маршрут для проверки email
router.post('/check-email', async (req: Request, res: Response) => {
  try {
    await check_email(req, res);
  } catch (error) {
    console.error('Error during check-email:', error);
    res.status(500).send('Check-email failed');
  }
});

//Маршрут для получения профиля
router.get('/profile', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  getProfile(req as AuthRequest, res, next);
});

// Маршрут для обновления профиля
router.put('/profile', protect as ProtectMiddleware, (req: Request, res: Response, next: NextFunction) => {
  updateProfile(req as AuthRequest, res, next);
});

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
      { fieldName: 'createdAt', format: (date) => new Date(date).toLocaleDateString() },
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
    otherFields: [{ fieldName: 'createdAt', format: (date) => new Date(date).toLocaleDateString() }],
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
      createPageUrl: '/characters/create',
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
        { fieldName: 'date', optional: true, defaultValue: '' },
      ],
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

///
///
///

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
    const { typePage } = req.query; // Get typePage from query parameters

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
  '/projects/:projectId/timelines/:timelineId',
  protect as ProtectMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    getItemById(
      req,
      res,
      next,
      'timelineId',
      'Timeline',
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

///
///
///

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

///
///
///

router.get('/create-page-data/:type', protect as ProtectMiddleware, (req: Request, res: Response) => {
  const { type } = req.params;

  console.log('Type create-page: ' + type);

  const pageData = createPageData.find((item) => item.type === type);

  if (pageData) {
    res.status(200).json(pageData);
  } else {
    res.status(404).json({ message: 'Create page data not found' });
    return;
  }
});

///
///
///

export default router;
