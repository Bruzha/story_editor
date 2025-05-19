import { Model, DataTypes, Sequelize } from 'sequelize';
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
  getUser: () => Promise<UserInstance>; // Add association method
}

export const ProjectFactory = (sequelize: Sequelize, dataType: typeof DataTypes) => {
  class Project extends Model<ProjectAttributes, ProjectAttributes> implements ProjectInstance {
    public id!: number;
    public userId!: number;
    public info!: any;
    public status!: enum_projects_status;
    public miniature!: Buffer | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: () => Promise<UserInstance>; // Define association method
  }

  Project.init(
    {
      id: {
        type: dataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: dataType.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // This needs to match the table name
          key: 'id',
        },
      },
      info: {
        type: dataType.JSONB,
        allowNull: true, // Changed to true, if your column can be null
      },
      status: {
        type: dataType.ENUM(...Object.values(enum_projects_status)),
        allowNull: false,
        defaultValue: enum_projects_status.PLANNED,
        field: 'status',
      },
      miniature: {
        type: dataType.BLOB('long'),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Projects', // Needs to match ur table name
    }
  );

  return Project;
};
