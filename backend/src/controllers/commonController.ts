import { Request, Response, NextFunction } from 'express';
import AuthRequest from '../middleware/AuthRequest';
import { Sequelize, DataTypes } from 'sequelize';
import { ProjectFactory } from '../models/Project';
import { UserFactory } from '../models/User';
import { sequelize } from '../config/database';
import { title } from 'process';

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

      if (options.src) {
        itemData.src = '.';
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

    let info = item.info || {}; // Default info to item.info

    if (modelName === 'Character' && additionalOptions.dataType) {
      // Override info only for Character model
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

    const responseData = {
      ...item.get(),
      info: info,
      typeSidebar: additionalOptions.typeSidebar,
      title: additionalOptions.title,
      showImageInput: additionalOptions.showImageInput,
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
    const Model = modelFactory(sequelize, DataTypes) as any;
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
    await item.destroy();
    res.status(200).json({ message: `${modelName} deleted successfully` });
  } catch (error) {
    console.error(`Ошибка при удалении ${modelName}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
