import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

interface TimelineEventAttributes {
  id?: number;
  projectId: number;
  info: any;
  markerColor: string | null;
}

export interface TimelineEventInstance extends Model<TimelineEventAttributes>, TimelineEventAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface TimelineEventModel extends ModelStatic<TimelineEventInstance> {
  associate: (models: any) => void;
}

export const TimelineEventFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): TimelineEventModel => {
  const TimelineEvent = sequelize.define<TimelineEventInstance, TimelineEventAttributes>(
    'TimelineEvent',
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
      tableName: 'TimelineEvents',
    }
  ) as TimelineEventModel;

  TimelineEvent.associate = (models: any) => {
    TimelineEvent.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return TimelineEvent;
};
