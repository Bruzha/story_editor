import { Request, Response, NextFunction } from 'express';
import AuthRequest from '../middleware/AuthRequest';
import { Sequelize, DataTypes, ModelStatic, Op } from 'sequelize';
import { ProjectFactory } from '../models/Project';
import { UserFactory } from '../models/User';
import { sequelize } from '../config/database';
import createPageData from '../data/createPageData';
import { GroupObjectFactory } from '../models/GroupObject';
import { GroupCharacterFactory } from '../models/GroupCharacter';
import { GroupLocationFactory } from '../models/GroupLocation';
import { ChapterTimelineEventFactory } from '../models/ChapterTimelineEvent';
import { CharacterTimelineEventFactory } from '../models/CharacterTimelineEvent';
import { TimelineEventLocationFactory } from '../models/TimelineEventLocation';
import { TimelineEventObjectFactory } from '../models/TimelineEventObject';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { CharacterFactory } from '../models/Character';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { ChapterFactory } from '../models/Chapter';
import { PlotLineFactory } from '../models/PlotLine';
import { NoteFactory } from '../models/Note';
import { GroupFactory } from '../models/Group';

interface ModelFactory {
  (sequelize: Sequelize, dataTypes: typeof DataTypes): any;
}

interface InfoFieldDefinition {
  fieldName: string;
  optional?: boolean;
  defaultValue?: any;
}

interface OtherFieldDefinition {
  fieldName: string;
  format?: (value: any) => string;
}

interface Options {
  displayFields: any;
  modelName: string;
  modelFactory: ModelFactory;
  title: string;
  subtitleSource: 'user' | 'project';
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  typeCard: string;
  createPageUrl: string;
  infoFields?: InfoFieldDefinition[];
  otherFields?: OtherFieldDefinition[];
  src?: boolean;
  userIdField?: string;
  projectIdRequired?: boolean;
  where?: any;
}

interface AdditionalOptions {
  typeSidebar: string;
  title: string;
  showImageInput: boolean;
  dataType?: string;
}

export const formatDate = (date: Date | null) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

export const getItems = async (req: Request, res: Response, next: NextFunction, options: Options) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { projectId } = req.params;

    const Model = options.modelFactory(sequelize, DataTypes) as any;
    const User = UserFactory(sequelize, DataTypes) as any;
    const Project = ProjectFactory(sequelize, DataTypes) as any;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const whereClause: any = {};
    if (options.userIdField) {
      whereClause[options.userIdField] = userId;
    }
    if (options.projectIdRequired && projectId) {
      whereClause.projectId = projectId;
    }

    if (options.where) {
      Object.assign(whereClause, options.where);
    }

    const items = await Model.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    const formattedItems = items.map((item: any) => {
      const itemData: any = { ...item.get({ plain: true }) };
      if (options.src && item.miniature) {
        const byteArray = item.miniature;
        const base64String = Buffer.from(byteArray).toString('base64');
        itemData.src = `data:image/png;base64,${base64String}`;
      } else {
        itemData.src = null;
      }

      if (itemData.createdAt) {
        itemData.createdAt = formatDate(new Date(itemData.createdAt));
      }
      if (itemData.updatedAt) {
        itemData.updatedAt = formatDate(new Date(itemData.updatedAt));
      }
      if (itemData.eventDate) {
        itemData.eventDate = formatDate(new Date(itemData.eventDate));
      }

      return itemData;
    });

    let subtitle = '';

    if (options.subtitleSource === 'user') {
      subtitle = user.username;
    } else if (options.subtitleSource === 'project') {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      subtitle = project.info.name.value;
    }

    const responseData = {
      masItems: formattedItems,
      typeSidebar: options.typeSidebar,
      typeCard: options.typeCard,
      title: options.title,
      subtitle: subtitle,
      createPageUrl: options.createPageUrl,
      displayFields: options.displayFields,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Ошибка при получении ${options.modelName}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
  itemIdParamName: string,
  modelName: string,
  modelFactory: ModelFactory,
  additionalOptions: AdditionalOptions,
  parentModelName?: string,
  parentModelFactory?: ModelFactory,
  parentIdParamName?: string
) => {
  try {
    const itemId = req.params[itemIdParamName];

    if (!itemId) {
      return res.status(400).json({ message: `${modelName} ID is required` });
    }

    const Model = modelFactory(sequelize, DataTypes) as any;

    const whereClause: any = {
      id: itemId,
    };

    if (parentModelName && parentModelFactory && parentIdParamName) {
      const parentId = req.params[parentIdParamName];
      if (!parentId) {
        return res.status(400).json({ message: `${parentModelName} ID is required` });
      }
      whereClause[parentIdParamName] = parentId;
    }

    const item = await Model.findOne({
      where: whereClause,
    });

    if (!item) {
      return res.status(404).json({ message: `${modelName} not found` });
    }

    if ((modelName === 'Project' || modelName === 'Idea') && req.user && item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    let info = item.info || {};

    if (modelName === 'Character' && additionalOptions.dataType) {
      if (additionalOptions.dataType === 'info') {
        info = item.info || {};
      } else if (additionalOptions.dataType === 'appearance') {
        info = item.info_appearance || {};
      } else if (additionalOptions.dataType === 'personality') {
        info = item.info_personality || {};
      } else if (additionalOptions.dataType === 'social') {
        info = item.info_social || {};
      }
    }
    let createPageDataItem = createPageData.find((data) => data.type === modelName.toLowerCase() + 's');

    if (modelName === 'Character' && additionalOptions.dataType) {
      createPageDataItem = createPageData.find(
        (data) => data.type === modelName.toLowerCase() + 's' && data.typePage === additionalOptions.dataType
      );
    }

    const masTitle = createPageDataItem?.masTitle;

    let newInfo: any = {};
    const extraInfo: any = {};
    if (masTitle) {
      masTitle.forEach((masTitleItem) => {
        const key = masTitleItem.key;
        if (info[key]) {
          newInfo[key] = {
            ...info[key],
            title: masTitleItem.title,
            placeholder: masTitleItem.placeholder,
            removable: masTitleItem.removable,
          };
        }
      });
      Object.keys(info).forEach((key) => {
        if (!masTitle.find((item) => item.key === key)) {
          extraInfo[key] = info[key];
        }
      });
    } else {
      newInfo = info;
    }
    info = { ...newInfo, ...extraInfo };

    let src: string | null = null;
    if (item.miniature) {
      const byteArray = item.miniature;
      const base64String = Buffer.from(byteArray).toString('base64');
      src = `data:image/png;base64,${base64String}`;
    }

    const itemData = item.get({ plain: true });

    // Форматируем даты
    if (itemData.createdAt) {
      itemData.createdAt = formatDate(new Date(itemData.createdAt));
    }
    if (itemData.updatedAt) {
      itemData.updatedAt = formatDate(new Date(itemData.updatedAt));
    }
    if (itemData.eventDate) {
      itemData.eventDate = formatDate(new Date(itemData.eventDate));
    }

    const responseData = {
      ...itemData,
      info: info,
      typeSidebar: additionalOptions.typeSidebar,
      title: additionalOptions.title,
      showImageInput: additionalOptions.showImageInput,
      src: src,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(`Error fetching ${modelName} by ID:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const deleteItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
  itemId: any,
  modelName: string,
  modelFactory: ModelFactory,
  userIdField?: string
) => {
  try {
    if (!itemId) {
      return res.status(400).json({ message: `${modelName} ID is required` });
    }

    const GroupObject = GroupObjectFactory(sequelize, DataTypes);
    (sequelize as any).models.GroupObject = GroupObject;
    const GroupCharacter = GroupCharacterFactory(sequelize, DataTypes);
    (sequelize as any).models.GroupCharacter = GroupCharacter;
    const GroupLocation = GroupLocationFactory(sequelize, DataTypes);
    (sequelize as any).models.GroupLocation = GroupLocation;
    const ChapterTimelineEvent = ChapterTimelineEventFactory(sequelize, DataTypes);
    (sequelize as any).models.ChapterTimelineEvent = ChapterTimelineEvent;
    const CharacterTimelineEvent = CharacterTimelineEventFactory(sequelize, DataTypes);
    (sequelize as any).models.CharacterTimelineEvent = CharacterTimelineEvent;
    const LocationTimelineEvent = TimelineEventLocationFactory(sequelize, DataTypes);
    (sequelize as any).models.LocationTimelineEvent = LocationTimelineEvent;
    const ObjectTimelineEvent = TimelineEventObjectFactory(sequelize, DataTypes);
    (sequelize as any).models.ObjectTimelineEvent = ObjectTimelineEvent;

    const userId = req.user!.id;
    const Model = modelFactory(sequelize, DataTypes) as ModelStatic<any>;
    const whereClause: any = {
      id: itemId,
    };
    if (userIdField) {
      whereClause[userIdField] = userId;
    }

    const item = await Model.findOne({
      where: whereClause,
    });
    if (!item) {
      return res.status(404).json({ message: `${modelName} not found or unauthorized` });
    }

    //  Удаление связей из связующих таблиц
    if (modelName === 'Object' || modelName === 'Group') {
      const GroupObjectModel = (sequelize as any).models.GroupObject;
      if (modelName === 'Object') await GroupObjectModel.destroy({ where: { objectId: itemId } });
      if (modelName === 'Group') await GroupObjectModel.destroy({ where: { groupId: itemId } });
    }
    if (modelName === 'Character' || modelName === 'Group') {
      const GroupCharacterModel = (sequelize as any).models.GroupCharacter;
      if (modelName === 'Character') await GroupCharacterModel.destroy({ where: { characterId: itemId } });
      if (modelName === 'Group') await GroupCharacterModel.destroy({ where: { groupId: itemId } });
    }
    if (modelName === 'Location' || modelName === 'Group') {
      const GroupLocationModel = (sequelize as any).models.GroupLocation;
      if (modelName === 'Location') await GroupLocationModel.destroy({ where: { locationId: itemId } });
      if (modelName === 'Group') await GroupLocationModel.destroy({ where: { groupId: itemId } });
    }
    if (modelName === 'Chapter' || modelName === 'TimelineEvent') {
      const ChapterTimelineEventModel = (sequelize as any).models.ChapterTimelineEvent;
      if (modelName === 'Chapter') await ChapterTimelineEventModel.destroy({ where: { chapterId: itemId } });
      if (modelName === 'TimelineEvent')
        await ChapterTimelineEventModel.destroy({ where: { timelineEventId: itemId } });
    }
    if (modelName === 'Character' || modelName === 'TimelineEvent') {
      const CharacterTimelineEventModel = (sequelize as any).models.CharacterTimelineEvent;
      if (modelName === 'Character') await CharacterTimelineEventModel.destroy({ where: { characterId: itemId } });
      if (modelName === 'TimelineEvent')
        await CharacterTimelineEventModel.destroy({ where: { timelineEventId: itemId } });
    }
    if (modelName === 'Location' || modelName === 'TimelineEvent') {
      const LocationTimelineEventModel = (sequelize as any).models.LocationTimelineEvent;
      if (modelName === 'Location') await LocationTimelineEventModel.destroy({ where: { locationId: itemId } });
      if (modelName === 'TimelineEvent')
        await LocationTimelineEventModel.destroy({ where: { timelineEventId: itemId } });
    }
    if (modelName === 'Object' || modelName === 'TimelineEvent') {
      const ObjectTimelineEventModel = (sequelize as any).models.ObjectTimelineEvent;
      if (modelName === 'Object') await ObjectTimelineEventModel.destroy({ where: { objectId: itemId } });
      if (modelName === 'TimelineEvent') await ObjectTimelineEventModel.destroy({ where: { timelineEventId: itemId } });
    }

    //  Удаление связанных элементов, если удаляется проект
    if (modelName === 'Project') {
      const ChapterModel = ChapterFactory(sequelize, DataTypes);
      const CharacterModel = CharacterFactory(sequelize, DataTypes);
      const LocationModel = LocationFactory(sequelize, DataTypes);
      const NoteModel = NoteFactory(sequelize, DataTypes);
      const ObjectModel = ObjectFactory(sequelize, DataTypes);
      const PlotLineModel = PlotLineFactory(sequelize, DataTypes);
      const TimelineEventModel = TimelineEventFactory(sequelize, DataTypes);
      const GroupModel = GroupFactory(sequelize, DataTypes);

      //  Удаление Chapters
      const chapters = await ChapterModel.findAll({ where: { projectId: itemId } });
      for (const chapter of chapters) {
        const ChapterTimelineEventModel = (sequelize as any).models.ChapterTimelineEvent;
        await ChapterTimelineEventModel.destroy({ where: { chapterId: chapter.id } });
        await chapter.destroy();
      }

      //  Удаление Characters
      const characters = await CharacterModel.findAll({ where: { projectId: itemId } });
      for (const character of characters) {
        const GroupCharacterModel = (sequelize as any).models.GroupCharacter;
        await GroupCharacterModel.destroy({ where: { characterId: character.id } });
        const CharacterTimelineEventModel = (sequelize as any).models.CharacterTimelineEvent;
        await CharacterTimelineEventModel.destroy({ where: { characterId: character.id } });
        await character.destroy();
      }

      //  Удаление Locations
      const locations = await LocationModel.findAll({ where: { projectId: itemId } });
      for (const location of locations) {
        const GroupLocationModel = (sequelize as any).models.GroupLocation;
        await GroupLocationModel.destroy({ where: { locationId: location.id } });
        const LocationTimelineEventModel = (sequelize as any).models.LocationTimelineEvent;
        await LocationTimelineEventModel.destroy({ where: { locationId: location.id } });
        await location.destroy();
      }

      //  Удаление Notes
      const notes = await NoteModel.findAll({ where: { projectId: itemId } });
      for (const note of notes) {
        await note.destroy();
      }

      //  Удаление Objects
      const objects = await ObjectModel.findAll({ where: { projectId: itemId } });
      for (const object of objects) {
        const GroupObjectModel = (sequelize as any).models.GroupObject;
        await GroupObjectModel.destroy({ where: { objectId: object.id } });
        const ObjectTimelineEventModel = (sequelize as any).models.ObjectTimelineEvent;
        await ObjectTimelineEventModel.destroy({ where: { objectId: object.id } });
        await object.destroy();
      }

      //  Удаление PlotLines
      const plotLines = await PlotLineModel.findAll({ where: { projectId: itemId } });
      for (const plotLine of plotLines) {
        await plotLine.destroy();
      }

      //  Удаление TimelineEvents
      const timelineEvents = await TimelineEventModel.findAll({ where: { projectId: itemId } });
      for (const timelineEvent of timelineEvents) {
        const ChapterTimelineEventModel = (sequelize as any).models.ChapterTimelineEvent;
        await ChapterTimelineEventModel.destroy({ where: { timelineEventId: timelineEvent.id } });
        const CharacterTimelineEventModel = (sequelize as any).models.CharacterTimelineEvent;
        await CharacterTimelineEventModel.destroy({ where: { timelineEventId: timelineEvent.id } });
        const LocationTimelineEventModel = (sequelize as any).models.LocationTimelineEvent;
        await LocationTimelineEventModel.destroy({ where: { timelineEventId: timelineEvent.id } });
        const ObjectTimelineEventModel = (sequelize as any).models.ObjectTimelineEvent;
        await ObjectTimelineEventModel.destroy({ where: { timelineEventId: timelineEvent.id } });
        await timelineEvent.destroy();
      }

      //  Удаление Groups
      const groups = await GroupModel.findAll({ where: { projectId: itemId } });
      for (const group of groups) {
        const GroupCharacterModel = (sequelize as any).models.GroupCharacter;
        await GroupCharacterModel.destroy({ where: { groupId: group.id } });
        const GroupLocationModel = (sequelize as any).models.GroupLocation;
        await GroupLocationModel.destroy({ where: { groupId: group.id } });
        const GroupObjectModel = (sequelize as any).models.GroupObject;
        await GroupObjectModel.destroy({ where: { groupId: group.id } });
        await group.destroy();
      }
    }

    await item.destroy();

    res.status(200).json({ message: `${modelName} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting ${modelName}:`, error);
    res.status(500).json({ message: `Error deleting ${modelName}` });
    next(error);
  }
};

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
  modelName: string,
  modelFactory: ModelFactory
) => {
  try {
    const { info, status, miniature, markerColor, type, eventDate, projectId, userId, content, sceneStructure } =
      req.body;
    const currentUserId = (req as any).user?.id;
    const Model = modelFactory(sequelize, DataTypes) as any;
    const ModelAttributes = Model.rawAttributes;
    const createData: any = {};
    createData.info = info;
    createData.markerColor = markerColor || '#4682B4';
    if (ModelAttributes.userId) {
      createData.userId = userId || currentUserId;
    }
    if (ModelAttributes.projectId) {
      createData.projectId = projectId;
    }
    if (ModelAttributes.status) {
      if (modelName === 'Project') createData.status = status || 'запланирован';
      if (modelName === 'Chapter') createData.status = status || 'запланирована';
    }
    if (ModelAttributes.type) {
      createData.type = type || 'главная';
    }
    if (ModelAttributes.eventDate) {
      createData.eventDate = eventDate || new Date();
    }
    if (ModelAttributes.miniature) {
      createData.miniature = miniature || null;
    }
    if (ModelAttributes.content) {
      createData.content = content;
    }
    if (ModelAttributes.sceneStructure) {
      createData.sceneStructure = sceneStructure;
    }

    console.log('createData:', createData);
    const newItem = await Model.create(createData);

    const fullNewItem = await Model.findByPk(newItem.id);

    const itemData = fullNewItem.get({ plain: true });

    let src: string | null = null;
    if (fullNewItem.miniature) {
      const byteArray = fullNewItem.miniature;
      const base64String = Buffer.from(byteArray).toString('base64');
      src = `data:image/png;base64,${base64String}`;
    }

    const formattedItem = {
      ...itemData,
      src: src,
      createdAt: formatDate(new Date(itemData.createdAt)),
      updatedAt: formatDate(new Date(itemData.updatedAt)),
      eventDate: itemData.eventDate ? formatDate(new Date(itemData.eventDate)) : null,
    };

    res.status(201).json(formattedItem);
  } catch (error) {
    console.error(`Error creating ${modelName}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

// export const updateItem = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   modelName: string,
//   modelFactory: ModelFactory
// ) => {
//   try {
//     const { id } = req.params;
//     const { info, info_appearance, info_personality, info_social, status, miniature, markerColor } = req.body;

//     const Model = modelFactory(sequelize, DataTypes) as any;
//     const item = await Model.findByPk(id);

//     if (!item) {
//       return res.status(404).json({ message: `${modelName} not found` });
//     }
//     const updateData: any = {};

//     if (info) {
//       updateData.info = info;
//     }
//     if (info_appearance) {
//       updateData.info_appearance = info_appearance;
//     }
//     if (info_personality) {
//       updateData.info_personality = info_personality;
//     }
//     if (info_social) {
//       updateData.info_social = info_social;
//     }
//     if (status) {
//       updateData.status = status;
//     }
//     if (miniature) {
//       updateData.miniature = miniature;
//     }
//     if (markerColor) {
//       updateData.markerColor = markerColor;
//     }

//     await item.update(updateData);

//     const updatedItem = await Model.findByPk(id);

//     res.json(updatedItem);
//   } catch (error) {
//     console.error(`Error updating ${modelName}:`, error);
//     res.status(500).json({ message: `Error updating ${modelName}` });
//     next(error);
//   }
// };

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
  modelName: string,
  modelFactory: ModelFactory
) => {
  try {
    const { id } = req.params;
    const { info, info_appearance, info_personality, info_social, status, type, miniature, markerColor, eventDate } =
      req.body;
    console.log('eventDate: ', eventDate);
    const Model = modelFactory(sequelize, DataTypes) as any;
    const item = await Model.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: `${modelName} not found` });
    }
    const updateData: any = {};

    if (info) {
      updateData.info = info;
    }
    if (info_appearance) {
      updateData.info_appearance = info_appearance;
    }
    if (info_personality) {
      updateData.info_personality = info_personality;
    }
    if (info_social) {
      updateData.info_social = info_social;
    }
    if (status) {
      updateData.status = status;
    }
    if (miniature) {
      updateData.miniature = miniature;
    }
    if (markerColor) {
      updateData.markerColor = markerColor;
    }
    if (type) {
      updateData.type = type;
    }
    if (eventDate) {
      updateData.eventDate = eventDate;
    }

    await item.update(updateData);

    const updatedItem = await Model.findByPk(id);

    const itemData = updatedItem.get({ plain: true });

    // Преобразуем миниатюру в base64 строку
    let src: string | null = null;
    if (updatedItem.miniature) {
      const byteArray = updatedItem.miniature;
      const base64String = Buffer.from(byteArray).toString('base64');
      src = `data:image/png;base64,${base64String}`;
    }

    const formattedItem = {
      ...itemData,
      src: src,
      eventDate: formatDate(new Date(itemData.eventDate)),
      createdAt: formatDate(new Date(itemData.createdAt)),
      updatedAt: formatDate(new Date(itemData.updatedAt)),
    };

    res.json(formattedItem);
  } catch (error) {
    console.error(`Error updating ${modelName}:`, error);
    res.status(500).json({ message: `Error updating ${modelName}` });
    next(error);
  }
};

export const getTimelineFilters = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    // Создаем модели из фабричных функций
    const TimelineEvent = TimelineEventFactory(sequelize, DataTypes) as any;
    const CharacterTimelineEvent = CharacterTimelineEventFactory(sequelize, DataTypes);
    const TimelineEventLocation = TimelineEventLocationFactory(sequelize, DataTypes);
    const TimelineEventObject = TimelineEventObjectFactory(sequelize, DataTypes);
    const ChapterTimelineEvent = ChapterTimelineEventFactory(sequelize, DataTypes);
    const Character = CharacterFactory(sequelize, DataTypes);
    const Location = LocationFactory(sequelize, DataTypes);
    const Object = ObjectFactory(sequelize, DataTypes);
    const Chapter = ChapterFactory(sequelize, DataTypes);

    // Получаем идентификаторы событий временной шкалы для проекта
    const timelineEvents = await TimelineEvent.findAll({
      where: { projectId },
      attributes: ['id', 'markerColor', 'info', 'miniature', 'eventDate', 'createdAt', 'updatedAt'], // Получаем все поля события
    });

    const timelineEventIds = timelineEvents.map((event: any) => event.id);

    // Вспомогательная функция для получения данных о связанных элементах
    const getRelatedItems = async (
      Model: any,
      timelineEventModel: any,
      foreignKey: string,
      nameField: string,
      markerColorField: string = 'markerColor' // Используем дефолтное значение для markerColorField
    ) => {
      const items = await Model.findAll({
        where: { projectId },
        attributes: ['id', 'info', markerColorField],
      });

      const itemsWithEvents = await Promise.all(
        items.map(async (item: any) => {
          const relatedTimelineEvents = await timelineEventModel.findAll({
            where: { [foreignKey]: item.id, timelineEventId: { [Op.in]: timelineEventIds } },
            attributes: ['timelineEventId'],
          });

          // Получаем полные данные событий из relatedTimelineEvents
          const timelineEventsData = await TimelineEvent.findAll({
            where: {
              id: {
                [Op.in]: relatedTimelineEvents.map((tev: any) => tev.timelineEventId),
              },
            },
            attributes: ['id', 'markerColor', 'info', 'miniature', 'eventDate', 'createdAt', 'updatedAt'], // Получаем все поля события
          });
          return {
            id: String(item.id),
            name:
              foreignKey === 'chapterId'
                ? `${item.info?.order.value || 'X'}. ${item.info?.title?.value || 'Без названия'}`
                : item.info?.[nameField]?.value || 'Без названия', // Используем nameField
            markerColor: item[markerColorField],
            timelineEvents: timelineEventsData.map((event: any) => ({
              // Изменили название поля с timelineEventIds на timelineEvents
              id: event.id,
              markerColor: event.markerColor,
              info: event.info,
              miniature: event.miniature,
              src: event.src,
              eventDate: formatDate(new Date(event.eventDate)),
              createdAt: formatDate(new Date(event.createdAt)),
              updatedAt: formatDate(new Date(event.updatedAt)),
            })),
          };
        })
      );

      return itemsWithEvents;
    };

    const characters = await getRelatedItems(Character, CharacterTimelineEvent, 'characterId', 'name');
    const locations = await getRelatedItems(Location, TimelineEventLocation, 'locationId', 'name');
    const objects = await getRelatedItems(Object, TimelineEventObject, 'objectId', 'name');
    const chapters = await getRelatedItems(Chapter, ChapterTimelineEvent, 'chapterId', 'title', 'markerColor');

    const filters = {
      characters,
      locations,
      objects,
      chapters,
    };

    res.json(filters);
  } catch (error) {
    console.error('Ошибка при получении фильтров временной шкалы:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении фильтров' });
  }
};
