// CharacterTimelineEvent.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface CharacterTimelineEventAttributes {
  characterId: number;
  timelineEventId: number;
}

export interface CharacterTimelineEventInstance
  extends Model<CharacterTimelineEventAttributes>,
    CharacterTimelineEventAttributes {}

export interface CharacterTimelineEventModel extends ModelStatic<CharacterTimelineEventInstance> {
  associate: (models: any) => void;
}

export const CharacterTimelineEventFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): CharacterTimelineEventModel => {
  const CharacterTimelineEvent = sequelize.define<CharacterTimelineEventInstance, CharacterTimelineEventAttributes>(
    'CharacterTimelineEvent',
    {
      characterId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Characters',
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
      tableName: 'CharacterTimelineEvent',
      timestamps: false,
    }
  ) as CharacterTimelineEventModel;

  CharacterTimelineEvent.associate = (models: any) => {
    CharacterTimelineEvent.belongsTo(models.Character, {
      foreignKey: 'characterId',
      as: 'character',
      onDelete: 'CASCADE',
    });
    CharacterTimelineEvent.belongsTo(models.TimelineEvent, {
      foreignKey: 'timelineEventId',
      as: 'timelineEvent',
      onDelete: 'CASCADE',
    });
  };

  return CharacterTimelineEvent;
};
