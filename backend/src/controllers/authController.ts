import { Request, Response, NextFunction } from 'express';
import { DataTypes, ModelStatic, UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { ProjectFactory, enum_projects_status } from '../models/Project';
import { IdeaFactory } from '../models/Idea';
import moment from 'moment';
import { formatDate } from './commonController';

interface BackendError {
  message: string;
  path: string;
}

interface UniqueConstraintErrorParent {
  message: string;
  detail?: string;
  constraint?: string;
}

interface AuthRequest extends Request {
  user?: UserInstance;
}

const JWT_EXPIRES_IN = '30d';
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
const cookieOptions: CookieOptions = {
  expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '30') * 24 * 60 * 60 * 1000),
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
    const token = signToken(newUser.id!);
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
      const errors: BackendError[] = [{ message, path }];
      return res.status(400).json({ message: 'Ошибка регистрации', errors: errors });
    }

    res.status(500).json({ message: 'Ошибка регистрации', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Необходимо указать email и пароль' });
    }
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }
    const token = signToken(user.id!);
    console.log('Generated token:', token);
    res.cookie('jwt', token, cookieOptions);
    console.log('Cookie установлен');
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
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Необходимо указать все данные для сброса пароля' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Пароли не совпадают' });
    }
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не найден' });
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'Новый пароль должен отличаться от старого' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: 'Пароль успешно сброшен' });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    res.status(500).json({ message: 'Ошибка при сбросе пароля' });
  }
};

export const check_email = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Необходимо указать email' });
    }
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь с таким email не найден' });
    }
    return res.status(200).json({ message: 'Email найден' });
  } catch (error) {
    console.error('Ошибка при проверке email:', error);
    res.status(500).json({ message: 'Ошибка при проверке email' });
  }
};

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
    const totalProjects = await Project.count({ where: { userId } });
    const plannedProjects = await Project.count({ where: { userId, status: enum_projects_status.PLANNED } });
    const inProgressProjects = await Project.count({ where: { userId, status: enum_projects_status.IN_PROGRESS } });
    const completedProjects = await Project.count({ where: { userId, status: enum_projects_status.COMPLETED } });
    const suspendedProjects = await Project.count({ where: { userId, status: enum_projects_status.SUSPENDED } });
    const totalIdeas = await Idea.count({ where: { userId } });
    res.status(200).json({
      email: user.email,
      role: user.role,
      date: formatDate(new Date(user.createdAt)),
      updateDate: formatDate(new Date(user.updatedAt)),
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
    user.username = login || user.username;
    user.firstName = name || user.firstName;
    user.lastName = lastname || user.lastName;
    user.updatedAt = moment().toDate();
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Ошибка при обновлении данных профиля:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
