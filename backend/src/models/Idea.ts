import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { UserInstance } from './User';

interface IdeaAttributes {
  id?: number;
  userId: number;
  info: any;
  markerColor?: string;
}

export interface IdeaInstance extends Model<IdeaAttributes>, IdeaAttributes {
  createdAt: Date;
  updatedAt: Date;
  getUser: () => Promise<UserInstance>;
}

export interface IdeaModel extends ModelStatic<IdeaInstance> {
  associate: (models: any) => void;
}

export const IdeaFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): IdeaModel => {
  const Idea = sequelize.define<IdeaInstance, IdeaAttributes>(
    'Idea',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      info: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
      markerColor: {
        type: dataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'Ideas',
    }
  ) as IdeaModel;

  Idea.associate = (models: any) => {
    Idea.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Idea;
};
