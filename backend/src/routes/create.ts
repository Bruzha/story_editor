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
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

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

interface AddRelationshipRequest extends Request {
  body: {
    groupId: string;
    characterId?: string;
    locationId?: string;
    objectId?: string;
  };
}

// Вспомогательная функция для добавления связи. DRY (Don't Repeat Yourself)
const addRelationship = async (
  req: AddRelationshipRequest,
  res: Response,
  next: NextFunction,
  relationModel: any, // Модель связующей таблицы (GroupCharacter и т.д.)
  targetModel: any, // Модель целевой сущности (Character, Location, Object)
  targetIdField: string // Название поля ID целевой сущности в связующей таблице
) => {
  const { groupId, characterId, locationId, objectId } = req.body;
  const targetId = characterId || locationId || objectId;
  if (!groupId || !targetId) {
    return res.status(400).json({ message: 'groupId and targetId are required' });
  }

  try {
    const group = await GroupFactory(sequelize, DataTypes).findByPk(groupId); // Используем фабрику
    const target = await targetModel(sequelize, DataTypes).findByPk(targetId);

    if (!group || !target) {
      return res.status(404).json({ message: 'Group or target entity not found' });
    }

    // Создаем связь
    await relationModel(sequelize, DataTypes).create({
      groupId: groupId,
      [targetIdField]: targetId, // Используем динамическое имя поля
    });

    res.status(201).json({ message: 'Relationship added successfully' });
  } catch (error) {
    console.error(`Error adding relationship:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

router.post(
  '/groups/add-character',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    // Импортируйте GroupCharacterFactory, если он у вас есть. Иначе замените на соответствующую модель, которую вы используете.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GroupCharacterFactory } = require('../models/GroupCharacter'); // Замените на путь к вашей модели GroupCharacter

    await addRelationship(req, res, next, GroupCharacterFactory, CharacterFactory, 'characterId');
  }
);

router.post(
  '/groups/add-location',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GroupLocationFactory } = require('../models/GroupLocation'); //  Замените на путь к вашей модели GroupLocation
    await addRelationship(req, res, next, GroupLocationFactory, LocationFactory, 'locationId');
  }
);

router.post(
  '/groups/add-object',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GroupObjectFactory } = require('../models/GroupObject'); //  Замените на путь к вашей модели GroupObject
    await addRelationship(req, res, next, GroupObjectFactory, ObjectFactory, 'objectId');
  }
);

export default router;
