import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import { DataTypes, ModelStatic } from 'sequelize';

// Расширяем интерфейс Request, чтобы добавить свойство user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token из заголовка Authorization:', token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    console.log('Token из cookie:', token);
  }

  if (!token) {
    return res.status(401).json({
      message: 'Вы не вошли в систему! Пожалуйста, войдите в систему, чтобы получить доступ.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        'ypjo$22$%urGHjksu645**wsupe/GhjsuYuhu2uhuGYswq542?.sJjwoar85Хet*klGGkGRDrabVsal8*Rqns433PlsjjwnHFqL93496*2'
    ) as { id: number };
    console.log('Декодированный токен:', decoded);

    const User = UserFactory(sequelize, DataTypes) as ModelStatic<UserInstance>;
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        message: 'Пользователь, принадлежащий этому токену, больше не существует.',
      });
    }

    req.user = currentUser;
    next();
    return;
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(401).json({
      message: 'Неверный токен. Пожалуйста, войдите снова.',
    });
  }
};
