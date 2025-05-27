import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

interface ObjectAttributes {
  id?: number;
  projectId: number;
  info: any;
  markerColor: string | null;
}

export interface ObjectInstance extends Model<ObjectAttributes>, ObjectAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface ObjectModel extends ModelStatic<ObjectInstance> {
  associate: (models: any) => void;
}

export const ObjectFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): ObjectModel => {
  const Object = sequelize.define<ObjectInstance, ObjectAttributes>(
    'Object',
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
      tableName: 'Objects',
    }
  ) as ObjectModel;

  Object.associate = (models: any) => {
    Object.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return Object;
};
