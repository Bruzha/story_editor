import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserInstance } from './User'; // Import UserInstance

interface IdeaAttributes {
  id?: number;
  userId: number;
  info: any; // Use any or define a more specific type for JSONB
}

export interface IdeaInstance extends Model<IdeaAttributes>, IdeaAttributes {
  createdAt: Date;
  updatedAt: Date;
  getUser: () => Promise<UserInstance>; // Add association method
}

export const IdeaFactory = (sequelize: Sequelize, dataType: typeof DataTypes) => {
  class Idea extends Model<IdeaAttributes, IdeaAttributes> implements IdeaInstance {
    public id!: number;
    public userId!: number;
    public info!: any;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getUser!: () => Promise<UserInstance>; // Define association method
  }

  Idea.init(
    {
      id: {
        type: dataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: dataType.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // This needs to match the table name
          key: 'id',
        },
      },
      info: {
        type: dataType.JSONB,
        allowNull: true, // Changed to true, if your column can be null
      },
    },
    {
      sequelize,
      tableName: 'Ideas', // Needs to match ur table name
    }
  );

  return Idea;
};
