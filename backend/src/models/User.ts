import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

interface UserAttributes {
  id?: number; // Теперь id необязателен, так как автоинкрементный
  username: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {
  createdAt: Date; // Add createdAt
  updatedAt: Date; // Add updatedAt
}

export const UserFactory = (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelStatic<UserInstance> => {
  // Исправлен тип возврата
  const User = sequelize.define<UserInstance>(
    'User',
    {
      id: {
        type: dataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: dataTypes.STRING,
        defaultValue: 'user',
      },
    },
    {
      tableName: 'Users', // Укажите имя таблицы
    }
  );

  return User;
};
