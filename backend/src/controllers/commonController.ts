import { Request, Response, NextFunction } from 'express';
import AuthRequest from '../middleware/AuthRequest';
import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
import { ProjectFactory } from '../models/Project';
import { UserFactory } from '../models/User';
import { sequelize } from '../config/database';
import createPageData from '../data/createPageData';

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
      const info = item.info;
      const data: any[] = [];

      if (options.infoFields) {
        options.infoFields.forEach((field) => {
          const value = info?.[field.fieldName]?.value || field.defaultValue || '';
          data.push(value);
        });
      }

      options.otherFields?.forEach((field) => {
        let value = item[field.fieldName];
        if (field.format) {
          value = field.format(value);
        }
        data.push(value);
      });

      const itemData: any = {
        id: item.id,
        data: data,
        markColor: item.markerColor,
      };

      if (options.src && item.miniature) {
        const byteArray = item.miniature;
        const base64String = Buffer.from(byteArray).toString('base64');
        itemData.src = `data:image/png;base64,${base64String}`;
      } else {
        itemData.src = null;
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

    const responseData = {
      ...item.get(),
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

    const sequelizeInstance = Model.sequelize as Sequelize;
    const queryInterface = sequelizeInstance.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    for (const table of tables) {
      try {
        const columns = await queryInterface.describeTable(table);
        if (columns && columns.projectId) {
          console.log(`Удаление связанных записей из таблицы ${table}`, { projectId: itemId });
          await queryInterface.bulkDelete(table, { projectId: itemId });
          console.log(`Удалены связанные записи из таблицы ${table}`);
        }
      } catch (error: any) {
        console.warn(`Ошибка при обработке таблицы ${table}:`, error.message);
      }
    }
    await item.destroy();
    res.status(200).json({ message: `${modelName} deleted successfully` });
  } catch (error: any) {
    console.error(`Ошибка при удалении ${modelName}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
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

    res.status(201).json(newItem);
  } catch (error) {
    console.error(`Error creating ${modelName}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
  modelName: string,
  modelFactory: ModelFactory
) => {
  try {
    const { id } = req.params;
    const { info, info_appearance, info_personality, info_social, status, miniature, markerColor } = req.body;

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

    await item.update(updateData);

    const updatedItem = await Model.findByPk(id);

    res.json(updatedItem);
  } catch (error) {
    console.error(`Error updating ${modelName}:`, error);
    res.status(500).json({ message: `Error updating ${modelName}` });
    next(error);
  }
};
