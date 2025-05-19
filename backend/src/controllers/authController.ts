import { Request, Response, NextFunction } from 'express';
import { DataTypes, ModelStatic, UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { ProjectFactory, ProjectInstance } from '../models/Project';
import { IdeaFactory, IdeaInstance } from '../models/Idea';

interface BackendError {
  message: string;
  path: string;
}

interface UniqueConstraintErrorParent {
  message: string;
  detail?: string;
  constraint?: string;
}

// Срок действия токена (6 часов)
const JWT_EXPIRES_IN = '6h';

// Функция для создания JWT
const signToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Параметры для cookies
const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000), // Перевод дней в милисекунды
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export const register = async (req: Request, res: Response) => {
  try {
    const { login, email, password } = req.body;

    console.log('Получены данные регистрации:', { login, email, password });

    if (!login || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Хешированный пароль:', hashedPassword);

    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;

    const newUser = await User.create({
      username: login,
      email: email,
      password: hashedPassword,
      firstName: null,
      lastName: null,
      role: 'user',
    });

    console.log('Новый пользователь создан:', newUser.toJSON());

    // Создание JWT токена
    const token = signToken(newUser.id!);

    // Отправить токен в cookie
    res.cookie('jwt', token, cookieOptions);
    console.log('Cookie установлен');

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      userId: newUser.id,
    });
  } catch (error: any) {
    console.error('Ошибка во время регистрации:', error);
    console.log('Тип ошибки:', error.constructor.name);
    console.log('Содержимое error.errors:', error.errors);
    if (error instanceof UniqueConstraintError) {
      const parent: UniqueConstraintErrorParent = error.parent;
      const message = parent.detail || parent.message || 'Ошибка уникальности';
      let path = 'unknown';
      if (parent.constraint) {
        path = parent.constraint.includes('username') ? 'login' : 'email';
      }
      const errors: BackendError[] = [{ message, path }]; // Массив ошибок
      return res.status(400).json({ message: 'Ошибка регистрации', errors: errors });
    }

    res.status(500).json({ message: 'Ошибка регистрации', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // 1. Проверка, что email и пароль переданы
    if (!email || !password) {
      return res.status(400).json({ message: 'Необходимо указать email и пароль' });
    }
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;

    // 2. Поиск пользователя по email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // 3. Сравнение паролей
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Создание JWT токена
    const token = signToken(user.id!);
    console.log('Generated token:', token);
    res.cookie('jwt', token, cookieOptions);
    console.log('Cookie установлен');

    // 4. Если все прошло успешно, отправка ответа
    res.status(200).json({
      message: 'Вход выполнен успешно',
      token,
      userId: user.id,
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
};

export const reset_password = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // 1. Проверка, что все необходимые данные переданы
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Необходимо указать все данные для сброса пароля' });
    }

    // 2. Проверка совпадения паролей
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Пароли не совпадают' });
    }

    // 3. Получение модели User
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;

    // 4. Поиск пользователя по email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не найден' });
    }

    // 5. Сравнение нового пароля со старым
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'Новый пароль должен отличаться от старого' });
    }

    // 6. Хеширование нового пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Обновление пароля пользователя
    user.password = hashedPassword;
    await user.save();

    // 8. Успешный ответ
    return res.status(200).json({ message: 'Пароль успешно сброшен' });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    res.status(500).json({ message: 'Ошибка при сбросе пароля' });
  }
};

export const check_email = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // 1. Проверка, что email передан
    if (!email) {
      return res.status(400).json({ message: 'Необходимо указать email' });
    }

    // 2. Модель User
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;

    // 3. Поиск пользователя по email
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не найден' });
    }

    // 4. Успешный ответ
    return res.status(200).json({ message: 'Email найден' });
  } catch (error) {
    console.error('Ошибка при проверке email:', error);
    res.status(500).json({ message: 'Ошибка при проверке email' });
  }
};

interface AuthRequest extends Request {
  user?: UserInstance;
}

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id;

    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Project = ProjectFactory(sequelize, DataTypes) as ModelStatic<ProjectInstance>;
    const Idea = IdeaFactory(sequelize, DataTypes) as ModelStatic<IdeaInstance>;

    const totalProjects = await Project.count({ where: { userId } });
    const plannedProjects = await Project.count({ where: { userId, status: 'запланирован' } });
    const inProgressProjects = await Project.count({ where: { userId, status: 'в процессе' } });
    const completedProjects = await Project.count({ where: { userId, status: 'завершен' } });
    const suspendedProjects = await Project.count({ where: { userId, status: 'приостановлен' } });
    const totalIdeas = await Idea.count({ where: { userId } });

    res.status(200).json({
      email: user.email,
      date: user.createdAt.toLocaleDateString(),
      updateDate: user.updatedAt.toLocaleDateString(),
      login: user.username,
      name: user.firstName || '',
      lastname: user.lastName || '',
      totalProjects,
      plannedProjects,
      inProgressProjects,
      completedProjects,
      suspendedProjects,
      totalIdeas,
    });
  } catch (error) {
    console.error('Ошибка при получении данных профиля:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
