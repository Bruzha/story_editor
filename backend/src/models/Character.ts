// character.ts
import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { ProjectInstance } from './Project';

interface CharacterAttributes {
  id?: number;
  projectId: number;
  info: any;
  info_appearance: any;
  info_personality: any;
  info_social: any;
  miniature: Buffer | null; // Тип Buffer для хранения двоичных данных (BYTEA)
  markerColor: string | null;
}

export interface CharacterInstance extends Model<CharacterAttributes>, CharacterAttributes {
  createdAt: Date;
  updatedAt: Date;
  getProject: () => Promise<ProjectInstance>;
}

export interface CharacterModel extends ModelStatic<CharacterInstance> {
  associate: (models: any) => void;
}

export const CharacterFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): CharacterModel => {
  const Character = sequelize.define<CharacterInstance, CharacterAttributes>(
    'Character',
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
      info_appearance: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      info_personality: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      info_social: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      miniature: {
        type: dataTypes.BLOB,
        allowNull: true,
      },
      markerColor: {
        type: dataTypes.STRING(7),
        allowNull: true,
      },
    },
    {
      tableName: 'Characters',
    }
  ) as CharacterModel;

  Character.associate = (models: any) => {
    Character.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
      onDelete: 'CASCADE',
    });
  };

  return Character;
};
