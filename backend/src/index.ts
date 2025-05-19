import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/database';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import { UserFactory } from './models/User';
import { ProjectFactory } from './models/Project';
import { IdeaFactory } from './models/Idea';
import { DataTypes } from 'sequelize';

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

// Cookie parser middleware
app.use(cookieParser());

// Настраиваем CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Разрешаем запросы с этого домена
    credentials: true, // Разрешаем отправку куки
  })
);

app.use(express.json()); // Используем middleware для обработки JSON-запросов

// Подключаем маршруты аутентификации
app.use('/auth', authRoutes);

// Initialize Sequelize models
const User = UserFactory(sequelize, DataTypes);
const Project = ProjectFactory(sequelize, DataTypes);
const Idea = IdeaFactory(sequelize, DataTypes);

// Define associations
(User as any).associate = () => {
  (User as any).hasMany(Project, {
    foreignKey: 'userId',
    as: 'projects',
    onDelete: 'CASCADE', // Add onDelete: 'CASCADE' if needed
  });
  (User as any).hasMany(Idea, {
    foreignKey: 'userId',
    as: 'ideas',
    onDelete: 'CASCADE', // Add onDelete: 'CASCADE' if needed
  });
};

(Project as any).associate = () => {
  (Project as any).belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

(Idea as any).associate = () => {
  (Idea as any).belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

// Call associate after defining models
(User as any).associate();
(Project as any).associate();
(Idea as any).associate();

// Функция для проверки подключения к базе данных
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

// Запускаем сервер после синхронизации базы данных
sequelize
  .sync({ alter: false }) // { alter: true }  автоматически обновит схему БД. Осторожно в production!
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
