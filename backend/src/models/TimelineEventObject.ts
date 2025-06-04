// TimelineEventObject.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface TimelineEventObjectAttributes {
  timelineEventId: number;
  objectId: number;
}

export interface TimelineEventObjectInstance
  extends Model<TimelineEventObjectAttributes>,
    TimelineEventObjectAttributes {}

export interface TimelineEventObjectModel extends ModelStatic<TimelineEventObjectInstance> {
  associate: (models: any) => void;
}

export const TimelineEventObjectFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): TimelineEventObjectModel => {
  const TimelineEventObject = sequelize.define<TimelineEventObjectInstance, TimelineEventObjectAttributes>(
    'TimelineEventObject',
    {
      timelineEventId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'TimelineEvents',
          key: 'id',
        },
      },
      objectId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Objects',
          key: 'id',
        },
      },
    },
    {
      tableName: 'TimelineEventObject',
      timestamps: false,
    }
  ) as TimelineEventObjectModel;

  TimelineEventObject.associate = (models: any) => {
    TimelineEventObject.belongsTo(models.TimelineEvent, {
      foreignKey: 'timelineEventId',
      as: 'timelineEvent',
      onDelete: 'CASCADE',
    });
    TimelineEventObject.belongsTo(models.Object, { foreignKey: 'objectId', as: 'object', onDelete: 'CASCADE' });
  };

  return TimelineEventObject;
};
