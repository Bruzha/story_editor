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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // 1. Проверяем, что email и пароль переданы
    if (!email || !password) {
      return res.status(400).json({ message: 'Необходимо указать email и пароль' });
    }
    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;

    // 2. Ищем пользователя по email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // 3. Сравниваем пароли
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // 4. Если все прошло успешно, отправляем ответ
    res.status(200).json({ message: 'Вход выполнен успешно' });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
};
