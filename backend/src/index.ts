import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/database';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

dotenv.config({ path: '../.env' }); // Загружаем переменные окружения из файла .env

const app = express();
const port = process.env.PORT || 3001;

// Настраиваем CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Разрешаем запросы с этого домена
    credentials: true, // Разрешаем отправку куки
  })
);

app.use(express.json()); // Используем middleware для обработки JSON-запросов

// Cookie parser middleware
app.use(cookieParser()); //  <---  Используем cookie-parser для обработки куки

// Routes
app.use('/auth', authRoutes); // Подключаем маршруты аутентификации

// Функция для проверки подключения к базе данных
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(); // Вызываем функцию для проверки подключения

// Запускаем сервер после синхронизации базы данных
sequelize
  .sync({ alter: true }) // { alter: true }  автоматически обновит схему БД. Осторожно в production!
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
