import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

interface GroupAttributes {
  id?: number;
  projectId: number;
  info: any;
  markerColor: string | null;
}

export interface GroupInstance extends Model<GroupAttributes>, GroupAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface GroupModel extends ModelStatic<GroupInstance> {
  associate: (models: any) => void;
}

export const GroupFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): GroupModel => {
  const Group = sequelize.define<GroupInstance, GroupAttributes>(
    'Group',
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
      markerColor: {
        type: dataTypes.STRING(7),
        allowNull: true,
      },
    },
    {
      tableName: 'Groups',
    }
  ) as GroupModel;

  Group.associate = (models: any) => {
    Group.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return Group;
};
