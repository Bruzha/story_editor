import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { UserInstance } from './User';

export enum enum_projects_status {
  PLANNED = 'запланирован',
  IN_PROGRESS = 'в процессе',
  COMPLETED = 'завершен',
  SUSPENDED = 'приостановлен',
}

interface ProjectAttributes {
  id?: number;
  userId: number;
  info: any;
  status: enum_projects_status;
  miniature: Buffer | null;
}

export interface ProjectInstance extends Model<ProjectAttributes>, ProjectAttributes {
  createdAt: Date;
  updatedAt: Date;
  getUser: () => Promise<UserInstance>;
  // user?: UserInstance; //  <-- Add this line
}

export interface ProjectModel extends ModelStatic<ProjectInstance> {
  associate: (models: any) => void;
}

export const ProjectFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): ProjectModel => {
  const Project = sequelize.define<ProjectInstance, ProjectAttributes>(
    'Project',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      info: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      status: {
        type: dataTypes.ENUM(...Object.values(enum_projects_status)),
        allowNull: false,
        defaultValue: enum_projects_status.PLANNED,
        field: 'status',
      },
      miniature: {
        type: dataTypes.BLOB('long'),
        allowNull: true,
      },
    },
    {
      tableName: 'Projects',
    }
  ) as ProjectModel;

  Project.associate = (models: any) => {
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Project;
};
