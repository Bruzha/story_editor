import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

export enum enum_chapters_status {
  PLANNED = 'запланирована',
  IN_PROGRESS = 'в процессе',
  COMPLETED = 'завершена',
  SUSPENDED = 'приостановлена',
}

interface ChapterAttributes {
  id?: number;
  projectId: number;
  info: any;
  content: string | null;
  sceneStructure: any;
  status: enum_chapters_status;
  markerColor: string | null;
  miniature: Buffer | null;
}

export interface ChapterInstance extends Model<ChapterAttributes>, ChapterAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface ChapterModel extends ModelStatic<ChapterInstance> {
  associate: (models: any) => void;
}

export const ChapterFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): ChapterModel => {
  const Chapter = sequelize.define<ChapterInstance, ChapterAttributes>(
    'Chapter',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
      },
      info: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      content: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      sceneStructure: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      status: {
        type: dataTypes.ENUM(...Object.values(enum_chapters_status)),
        allowNull: false,
        defaultValue: enum_chapters_status.PLANNED,
      },
      markerColor: {
        type: dataTypes.STRING(7),
        allowNull: true,
      },
      miniature: {
        type: dataTypes.BLOB('long'),
        allowNull: true,
      },
    },
    {
      tableName: 'Chapters',
    }
  ) as ChapterModel;

  Chapter.associate = (models: any) => {
    Chapter.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return Chapter;
};
