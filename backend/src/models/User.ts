import { Model, DataTypes, Sequelize } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

module.exports = (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public role!: 'user' | 'admin';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
      // Define association here
    }
  }

  User.init(
    {
      id: {
        type: dataTypes.INTEGER, // Тип INTEGER
        primaryKey: true,
      },
      username: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: dataTypes.STRING,
      },
      lastName: {
        type: dataTypes.STRING,
      },
      role: {
        type: dataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      createdAt: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users', // Specify the table name
    }
  );

  return User;
};