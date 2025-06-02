// GroupCharacter.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface GroupCharacterAttributes {
  groupId: number;
  characterId: number;
}

export interface GroupCharacterInstance extends Model<GroupCharacterAttributes>, GroupCharacterAttributes {}

export interface GroupCharacterModel extends ModelStatic<GroupCharacterInstance> {
  associate: (models: any) => void;
}

export const GroupCharacterFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): GroupCharacterModel => {
  const GroupCharacter = sequelize.define<GroupCharacterInstance, GroupCharacterAttributes>(
    'GroupCharacter',
    {
      groupId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Groups',
          key: 'id',
        },
      },
      characterId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Characters',
          key: 'id',
        },
      },
    },
    {
      tableName: 'GroupCharacter',
      timestamps: false,
    }
  ) as GroupCharacterModel;

  GroupCharacter.associate = (models: any) => {
    GroupCharacter.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group', onDelete: 'CASCADE' });
    GroupCharacter.belongsTo(models.Character, { foreignKey: 'characterId', as: 'character', onDelete: 'CASCADE' });
  };

  return GroupCharacter;
};
