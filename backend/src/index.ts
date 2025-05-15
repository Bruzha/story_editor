import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load environment variables from .env

const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_database_name',
  process.env.DB_USER || 'your_username',
  process.env.DB_PASSWORD || 'your_password',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  }
);

// Define the User model
const User = require('./models/User')(sequelize, DataTypes);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Try to fetch all users
    const users = await User.findAll();
    console.log('All users:', JSON.stringify(users, null, 2));

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();