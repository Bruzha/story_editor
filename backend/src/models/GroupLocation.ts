// GroupLocation.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface GroupLocationAttributes {
  groupId: number;
  locationId: number;
}

export interface GroupLocationInstance extends Model<GroupLocationAttributes>, GroupLocationAttributes {}

export interface GroupLocationModel extends ModelStatic<GroupLocationInstance> {
  associate: (models: any) => void;
}

export const GroupLocationFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): GroupLocationModel => {
  const GroupLocation = sequelize.define<GroupLocationInstance, GroupLocationAttributes>(
    'GroupLocation',
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
      tableName: 'GroupLocation',
      timestamps: false,
    }
  ) as GroupLocationModel;

  GroupLocation.associate = (models: any) => {
    GroupLocation.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group' });
    GroupLocation.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
  };

  return GroupLocation;
};
