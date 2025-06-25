// backend routes
import express, { Router, Request, Response, NextFunction } from 'express';
import { GroupFactory } from '../models/Group';
import { CharacterFactory } from '../models/Character';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { GroupCharacterFactory } from '../models/GroupCharacter';
import { GroupLocationFactory } from '../models/GroupLocation';
import { GroupObjectFactory } from '../models/GroupObject';
import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { protect } from '../middleware/authMiddleware';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { CharacterTimelineEventFactory } from '../models/CharacterTimelineEvent';
import { TimelineEventLocationFactory } from '../models/TimelineEventLocation';
import { TimelineEventObjectFactory } from '../models/TimelineEventObject';
import { ChapterFactory } from '../models/Chapter';
import { ChapterTimelineEventFactory } from '../models/ChapterTimelineEvent';
import { getTimelineFilters } from '../controllers/commonController';

interface AddRelationshipRequest extends Request {
  body: {
    itemId?: number;
    characterId?: number;
    locationId?: number;
    objectId?: number;
    eventId?: number;
    chapterId?: number;
  };
  params: {
    entityType: string;
  };
}

export interface DeleteRelationshipRequest extends Request {
  body: {
    itemId?: number;
    characterId?: number;
    locationId?: number;
    objectId?: number;
    eventId?: number;
    chapterId?: number;
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
  const { itemId, characterId, locationId, objectId, eventId, chapterId } = req.body;
  const targetId = characterId || locationId || objectId || eventId || chapterId;
  if (!itemId || !targetId) {
    return res.status(400).json({ message: 'groupId and targetId are required' });
  }

  try {
    const group = await model(sequelize, DataTypes).findByPk(itemId); // Используем фабрику
    const target = await targetModel(sequelize, DataTypes).findByPk(targetId);

    if (!group || !target) {
      return res.status(404).json({ message: 'Group or target entity not found' });
    }

    await relationModel(sequelize, DataTypes).create({
      [modelId]: itemId,
      [targetIdField]: targetId,
    });

    res.status(201).json({ message: 'Relationship added successfully' });
  } catch (error) {
    console.error(`Error adding relationship:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

interface ModelFactory {
  (sequelize: Sequelize, dataTypes: typeof DataTypes): any;
}

const deleteRelationship = async (
  req: DeleteRelationshipRequest,
  res: Response,
  next: NextFunction,
  relationModelFactory: ModelFactory, // Фабрика для связующей модели
  modelIdField: string,
  targetIdField: string
) => {
  const { itemId, characterId, locationId, objectId, eventId, chapterId } = req.body;
  const targetId = characterId || locationId || objectId || eventId || chapterId;

  if (!itemId || !targetId) {
    return res.status(400).json({ message: 'itemId and targetId are required' });
  }

  try {
    const RelationModel = relationModelFactory(sequelize, DataTypes) as any; // Получаем модель из фабрики
    console.log('RelationModel: ', RelationModel);
    const relation = await RelationModel.findOne({
      where: {
        [modelIdField]: itemId,
        [targetIdField]: targetId,
      },
    });
    console.log('relation: ', relation);
    await relation.destroy(); // Вызываем destroy на экземпляре модели
    res.json({ message: 'Relationship deleted successfully' });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    res.status(500).json({ message: 'Failed to delete relationship' });
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
  '/time_events/add-chapter',
  protect as ProtectMiddleware,
  async (req: AddRelationshipRequest, res: Response, next: NextFunction) => {
    await addRelationship(
      req,
      res,
      next,
      TimelineEventFactory,
      ChapterTimelineEventFactory,
      ChapterFactory,
      'timelineEventId',
      'chapterId'
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

router.get('/timeline/filters/:projectId', protect as ProtectMiddleware, getTimelineFilters);

router.get('/getExistingRelationships/:type/:id', protect as ProtectMiddleware, async (req, res: Response) => {
  const { type, id } = req.params;
  try {
    console.log('type: ', type);
    console.log('id: ', id);
    const CharacterTimelineEvent = CharacterTimelineEventFactory(sequelize, DataTypes);
    const TimelineEventLocation = TimelineEventLocationFactory(sequelize, DataTypes);
    const TimelineEventObject = TimelineEventObjectFactory(sequelize, DataTypes);
    const ChapterTimelineEvent = ChapterTimelineEventFactory(sequelize, DataTypes);
    const GroupCharacter = GroupCharacterFactory(sequelize, DataTypes);
    const GroupLocation = GroupLocationFactory(sequelize, DataTypes);
    const GroupObject = GroupObjectFactory(sequelize, DataTypes);

    let characterIds: string[] = [];
    let locationIds: string[] = [];
    let objectIds: string[] = [];
    let eventIds: string[] = [];
    let chapterIds: string[] = [];

    if (type === 'groups') {
      characterIds = await (
        await GroupCharacter.findAll({ where: { groupId: id } })
      ).map((rel: any) => String(rel.characterId));

      locationIds = await (
        await GroupLocation.findAll({ where: { groupId: id } })
      ).map((rel: any) => String(rel.locationId));

      objectIds = await (await GroupObject.findAll({ where: { groupId: id } })).map((rel: any) => String(rel.objectId));
    } else if (type === 'timelines') {
      characterIds = await (
        await CharacterTimelineEvent.findAll({ where: { timelineEventId: id } })
      ).map((rel: any) => String(rel.characterId));

      locationIds = await (
        await TimelineEventLocation.findAll({ where: { timelineEventId: id } })
      ).map((rel: any) => String(rel.locationId));

      objectIds = await (
        await TimelineEventObject.findAll({ where: { timelineEventId: id } })
      ).map((rel: any) => String(rel.objectId));

      chapterIds = await (
        await ChapterTimelineEvent.findAll({ where: { timelineEventId: id } })
      ).map((rel: any) => String(rel.chapterId));
    } else if (type === 'chapters') {
      eventIds = await (
        await ChapterTimelineEvent.findAll({ where: { chapterId: id } })
      ).map((rel: any) => String(rel.timelineEventId));
    }

    res.json({ characterIds, locationIds, objectIds, eventIds, chapterIds });
  } catch (error) {
    console.error('Error fetching existing relationships:', error);
    res.status(500).json({ message: 'Failed to fetch existing relationships' });
  }
});

router.delete(
  '/groups/delete-character',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, GroupCharacterFactory, 'groupId', 'characterId');
  }
);

router.delete(
  '/groups/delete-location',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, GroupLocationFactory, 'groupId', 'locationId');
  }
);

router.delete(
  '/time_events/delete-character',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, CharacterTimelineEventFactory, 'timelineEventId', 'characterId');
  }
);

router.delete(
  '/time_events/delete-location',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, TimelineEventLocationFactory, 'timelineEventId', 'locationId');
  }
);

router.delete(
  '/time_events/delete-object',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, TimelineEventObjectFactory, 'timelineEventId', 'objectId');
  }
);

router.delete(
  '/groups/delete-object',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, GroupObjectFactory, 'groupId', 'objectId');
  }
);

router.delete(
  '/time_events/delete-chapter',
  protect as ProtectMiddleware,
  async (req: DeleteRelationshipRequest, res: Response, next: NextFunction) => {
    await deleteRelationship(req, res, next, ChapterTimelineEventFactory, 'timelineEventId', 'chapterId');
  }
);

export default router;
