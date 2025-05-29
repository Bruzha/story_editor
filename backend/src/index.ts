import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize } from './config/database';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

// Cookie parser middleware
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
