// TimelineEventLocation.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface TimelineEventLocationAttributes {
  timelineEventId: number;
  locationId: number;
}

export interface TimelineEventLocationInstance
  extends Model<TimelineEventLocationAttributes>,
    TimelineEventLocationAttributes {}

export interface TimelineEventLocationModel extends ModelStatic<TimelineEventLocationInstance> {
  associate: (models: any) => void;
}

export const TimelineEventLocationFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): TimelineEventLocationModel => {
  const TimelineEventLocation = sequelize.define<TimelineEventLocationInstance, TimelineEventLocationAttributes>(
    'TimelineEventLocation',
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
      locationId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
      },
    },
    {
      tableName: 'TimelineEventLocation',
      timestamps: false,
    }
  ) as TimelineEventLocationModel;

  TimelineEventLocation.associate = (models: any) => {
    TimelineEventLocation.belongsTo(models.TimelineEvent, {
      foreignKey: 'timelineEventId',
      as: 'timelineEvent',
      onDelete: 'CASCADE',
    });
    TimelineEventLocation.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location', onDelete: 'CASCADE' });
  };

  return TimelineEventLocation;
};
