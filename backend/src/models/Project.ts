// backend/src/models/Project.ts
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
  markerColor?: string;
}

export interface ProjectInstance extends Model<ProjectAttributes>, ProjectAttributes {
  createdAt: Date;
  updatedAt: Date;
  getUser: () => Promise<UserInstance>;
}

export interface ProjectModel extends ModelStatic<ProjectInstance> {
  associate: (models: {
    User: any;
    Object: any;
    Character: any;
    PlotLine: any;
    Chapter: any;
    Group: any;
    Location: any;
    Note: any;
    TimelineEvent: any;
  }) => void;
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
      markerColor: {
        type: dataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'Projects',
      timestamps: true, // Add this line
    }
  ) as ProjectModel;

  Project.associate = (models: {
    User: any;
    Object: any;
    Character: any;
    PlotLine: any;
    Chapter: any;
    Group: any;
    Location: any;
    Note: any;
    TimelineEvent: any;
  }) => {
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.Object, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.Character, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.PlotLine, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.Chapter, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.Group, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.Location, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.Note, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
    Project.hasMany(models.TimelineEvent, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
  };

  return Project;
};
