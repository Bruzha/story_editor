import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

export enum enum_supportingmaterials_type {
  ADVICE = 'Совет',
  TERM = 'Термин',
}

interface SupportingMaterialAttributes {
  id?: number;
  title: string;
  content: string;
  type: enum_supportingmaterials_type;
}

export interface SupportingMaterialInstance extends Model<SupportingMaterialAttributes>, SupportingMaterialAttributes {
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportingMaterialModel extends ModelStatic<SupportingMaterialInstance> {
  associate: (models: any) => void;
}

export const SupportingMaterialFactory = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
): SupportingMaterialModel => {
  const SupportingMaterial = sequelize.define<SupportingMaterialInstance, SupportingMaterialAttributes>(
    'SupportingMaterial',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: dataTypes.ENUM(...Object.values(enum_supportingmaterials_type)),
        allowNull: false,
      },
    },
    {
      tableName: 'SupportingMaterials',
    }
  ) as SupportingMaterialModel;

  return SupportingMaterial;
};
