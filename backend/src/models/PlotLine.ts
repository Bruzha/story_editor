import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

export enum enum_plotlines_type {
  MAIN = 'главная',
  SECONDARY = 'второстепенная',
  EQUAL = 'равнозначная',
}

interface PlotLineAttributes {
  id?: number;
  projectId: number;
  info: any;
  type: enum_plotlines_type;
  markerColor: string;
}

export interface PlotLineInstance extends Model<PlotLineAttributes>, PlotLineAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface PlotLineModel extends ModelStatic<PlotLineInstance> {
  associate: (models: any) => void;
}

export const PlotLineFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): PlotLineModel => {
  const PlotLine = sequelize.define<PlotLineInstance, PlotLineAttributes>(
    'PlotLine',
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
      type: {
        type: dataTypes.ENUM(...Object.values(enum_plotlines_type)),
        allowNull: false,
        defaultValue: enum_plotlines_type.MAIN,
      },
      markerColor: {
        type: dataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'PlotLines',
    }
  ) as PlotLineModel;

  PlotLine.associate = (models: any) => {
    PlotLine.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });
  };

  return PlotLine;
};
