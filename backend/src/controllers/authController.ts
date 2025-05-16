import { Request, Response } from 'express';
import { DataTypes, ModelStatic, UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcryptjs';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';

interface BackendError {
  message: string;
  path: string;
}

interface UniqueConstraintErrorParent {
  message: string;
  detail?: string;
  constraint?: string;
}

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

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error: any) {
    console.error('Ошибка во время регистрации:', error);
    console.log('Тип ошибки:', error.constructor.name);
    console.log('Содержимое error.errors:', error.errors);
    if (error instanceof UniqueConstraintError) {
      const parent: UniqueConstraintErrorParent = error.parent;
      // Извлекаем информацию об ошибке из error.parent
      const message = parent.detail || parent.message || 'Ошибка уникальности'; // Получаем сообщение об ошибке
      let path = 'unknown';
      if (parent.constraint) {
        path = parent.constraint.includes('username') ? 'login' : 'email'; // Получаем имя поля (username или email)
      }
      const errors: BackendError[] = [{ message, path }]; // Формируем массив ошибок
      return res.status(400).json({ message: 'Ошибка регистрации', errors: errors });
    }

    res.status(500).json({ message: 'Ошибка регистрации', error: (error as Error).message });
  }
};
