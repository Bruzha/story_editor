// ChapterTimelineEvent.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface ChapterTimelineEventAttributes {
  chapterId: number;
  timelineEventId: number;
}

export interface ChapterTimelineEventInstance
  extends Model<ChapterTimelineEventAttributes>,
    ChapterTimelineEventAttributes {}

export interface ChapterTimelineEventModel extends ModelStatic<ChapterTimelineEventInstance> {
  associate: (models: any) => void;
}

export const ChapterTimelineEventFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): ChapterTimelineEventModel => {
  const ChapterTimelineEvent = sequelize.define<ChapterTimelineEventInstance, ChapterTimelineEventAttributes>(
    'ChapterTimelineEvent',
    {
      chapterId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Chapters',
          key: 'id',
        },
      },
      timelineEventId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'TimelineEvents',
          key: 'id',
        },
      },
    },
    {
      tableName: 'ChapterTimelineEvent',
      timestamps: false,
    }
  ) as ChapterTimelineEventModel;

  ChapterTimelineEvent.associate = (models: any) => {
    ChapterTimelineEvent.belongsTo(models.Chapter, {
      foreignKey: 'chapterId',
      as: 'chapter',
      onDelete: 'CASCADE',
    });
    ChapterTimelineEvent.belongsTo(models.TimelineEvent, {
      foreignKey: 'timelineEventId',
      as: 'timelineEvent',
      onDelete: 'CASCADE',
    });
  };

  return ChapterTimelineEvent;
};
