// GroupObject.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface GroupObjectAttributes {
  groupId: number;
  objectId: number;
}

export interface GroupObjectInstance extends Model<GroupObjectAttributes>, GroupObjectAttributes {}

export interface GroupObjectModel extends ModelStatic<GroupObjectInstance> {
  associate: (models: any) => void;
}

export const GroupObjectFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): GroupObjectModel => {
  const GroupObject = sequelize.define<GroupObjectInstance, GroupObjectAttributes>(
    'GroupObject',
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
      tableName: 'GroupObject',
      timestamps: false,
    }
  ) as GroupObjectModel;

  GroupObject.associate = (models: any) => {
    GroupObject.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    GroupObject.belongsTo(models.Object, { foreignKey: 'objectId', as: 'object' });
  };

  return GroupObject;
};
