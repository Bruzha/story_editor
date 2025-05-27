import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

interface LocationAttributes {
  id?: number;
  projectId: number;
  info: any;
  markerColor: string | null;
}

export interface LocationInstance extends Model<LocationAttributes>, LocationAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface LocationModel extends ModelStatic<LocationInstance> {
  associate: (models: any) => void;
}

export const LocationFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): LocationModel => {
  const Location = sequelize.define<LocationInstance, LocationAttributes>(
    'Location',
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
      tableName: 'Locations',
    }
  ) as LocationModel;

  Location.associate = (models: any) => {
    Location.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return Location;
};
