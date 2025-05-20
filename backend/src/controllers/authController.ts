import { Request, Response, NextFunction } from 'express';
import { DataTypes, ModelStatic, UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { ProjectFactory, ProjectInstance, enum_projects_status } from '../models/Project';
import { IdeaFactory } from '../models/Idea';

interface BackendError {
  message: string;
  path: string;
}

interface UniqueConstraintErrorParent {
  message: string;
  detail?: string;
  constraint?: string;
}

// Срок действия токена
const JWT_EXPIRES_IN = '30d';

// Функция для создания JWT
const signToken = (id: number): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET ||
      'ypjo$22$%urGHjksu645**wsupe/GhjsuYuhu2uhuGYswq542?.sJjwoar85Хet*klGGkGRDrabVsal8*Rqns433PlsjjwnHFqL93496*2',
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

// Параметры для cookies
const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '30') * 24 * 60 * 60 * 1000), // Перевод дней в милисекунды
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
    const Project = ProjectFactory(sequelize, DataTypes) as any;
    const Idea = IdeaFactory(sequelize, DataTypes) as any;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get project counts
    const totalProjects = await Project.count({ where: { userId } });
    const plannedProjects = await Project.count({ where: { userId, status: enum_projects_status.PLANNED } });
    const inProgressProjects = await Project.count({ where: { userId, status: enum_projects_status.IN_PROGRESS } });
    const completedProjects = await Project.count({ where: { userId, status: enum_projects_status.COMPLETED } });
    const suspendedProjects = await Project.count({ where: { userId, status: enum_projects_status.SUSPENDED } });

    // Get idea count
    const totalIdeas = await Idea.count({ where: { userId } });
    console.log('Данные для ответа:', {
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
    res.status(200).json({
      email: user.email,
      date: user.createdAt.toLocaleDateString(),
      updateDate: user.updatedAt.toLocaleDateString(),
      login: user.username,
      name: user.firstName || '',
      lastname: user.lastName || '',
      totalProjects: totalProjects || 0,
      plannedProjects: plannedProjects || 0,
      inProgressProjects: inProgressProjects || 0,
      completedProjects: completedProjects || 0,
      suspendedProjects: suspendedProjects || 0,
      totalIdeas: totalIdeas || 0,
    });
  } catch (error) {
    console.error('Ошибка при получении данных профиля:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id;
    const { login, name, lastname } = req.body;

    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.username = login || user.username;
    user.firstName = name || user.firstName;
    user.lastName = lastname || user.lastName;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Ошибка при обновлении данных профиля:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id; // Получаем ID пользователя из запроса

    const Project = ProjectFactory(sequelize, DataTypes) as any;

    const projects = await Project.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']], // Optional: Order by creation date
    });

    const formattedProjects = projects.map((project: ProjectInstance) => {
      const info = project.info; //  Access the 'info' field
      return {
        id: project.id,
        src: '', //  You'll need to handle miniature later.  Leave empty for now
        data: [
          info?.['title'] || 'Название не указано', // Access properties from 'info'
          info?.['fabula'] || 'Описание отсутствует',
          info?.['genre'] || 'Жанр не указан',
          project.createdAt.toLocaleDateString(), // Format the date
          project.status, // Assuming status is a string or enum
        ],
        markColor: info?.['markerColor'],
      };
    });

    res.status(200).json(formattedProjects); // Отправляем отформатированные проекты
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
