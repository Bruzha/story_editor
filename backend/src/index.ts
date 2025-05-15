import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/database'; // Импортируем sequelize
import authRoutes from './routes/auth'; // Импортируем маршруты аутентификации

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use authentication routes
app.use('/auth', authRoutes);

// Test connection function (no changes needed)
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Try to fetch all users
    const User = require('./models/User')(sequelize, require('sequelize').DataTypes); // Adjust the path if necessary
    const users = await User.findAll();
    console.log('All users:', JSON.stringify(users, null, 2));

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});