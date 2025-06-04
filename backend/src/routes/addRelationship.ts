// backend routes
import express, { Router, Request, Response, NextFunction } from 'express';
import { GroupFactory } from '../models/Group';
import { CharacterFactory } from '../models/Character';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { GroupCharacterFactory } from '../models/GroupCharacter';
import { GroupLocationFactory } from '../models/GroupLocation';
import { GroupObjectFactory } from '../models/GroupObject';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { protect } from '../middleware/authMiddleware';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { CharacterTimelineEventFactory } from '../models/CharacterTimelineEvent';
import { TimelineEventLocationFactory } from '../models/TimelineEventLocation';
import { TimelineEventObjectFactory } from '../models/TimelineEventObject';
import { ChapterFactory } from '../models/Chapter';
import { ChapterTimelineEventFactory } from '../models/ChapterTimelineEvent';

interface AddRelationshipRequest extends Request {
  body: {
    itemId?: number;
    characterId?: number;
    locationId?: number;
    objectId?: number;
    eventId?: number;
  };
  params: {
    entityType: string;
  };
}

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

const addRelationship = async (
  req: AddRelationshipRequest,
  res: Response,
  next: NextFunction,
  model: any,
  relationModel: any,
  targetModel: any,
  modelId: string,
  targetIdField: string
) => {
  const { itemId, characterId, locationId, objectId, eventId } = req.body;
  const targetId = characterId || locationId || objectId || eventId;
  if (!itemId || !targetId) {
    return res.status(400).json({ message: 'groupId and targetId are required' });
  }

  try {
    const group = await model(sequelize, DataTypes).findByPk(itemId); // Используем фабрику
    const target = await targetModel(sequelize, DataTypes).findByPk(targetId);

    if (!group || !target) {
      return res.status(404).json({ message: 'Group or target entity not found' });
    }

    // Создаем связь
    await relationModel(sequelize, DataTypes).create({
      [modelId]: itemId,
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
    await addRelationship(
      req,
      res,
      next,
      GroupFactory,
      GroupCharacterFactory,
      CharacterFactory,
      'groupId',
      'characterId'
    );
  }
);

router.post(
  '/groups/add-location',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(req, res, next, GroupFactory, GroupLocationFactory, LocationFactory, 'groupId', 'locationId');
  }
);

router.post(
  '/groups/add-object',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(req, res, next, GroupFactory, GroupObjectFactory, ObjectFactory, 'groupId', 'objectId');
  }
);

router.post(
  '/time_events/add-character',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(
      req,
      res,
      next,
      TimelineEventFactory,
      CharacterTimelineEventFactory,
      CharacterFactory,
      'timelineEventId',
      'characterId'
    );
  }
);

router.post(
  '/time_events/add-location',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(
      req,
      res,
      next,
      TimelineEventFactory,
      TimelineEventLocationFactory,
      LocationFactory,
      'timelineEventId',
      'locationId'
    );
  }
);

router.post(
  '/time_events/add-object',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(
      req,
      res,
      next,
      TimelineEventFactory,
      TimelineEventObjectFactory,
      ObjectFactory,
      'timelineEventId',
      'objectId'
    );
  }
);

router.post(
  '/chapters/add-timeEvent',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(
      req,
      res,
      next,
      ChapterFactory,
      ChapterTimelineEventFactory,
      TimelineEventFactory,
      'chapterId',
      'timelineEventId'
    );
  }
);

export default router;
