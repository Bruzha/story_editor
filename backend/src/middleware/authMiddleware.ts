import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import { DataTypes, ModelStatic } from 'sequelize';

interface AuthRequest extends Request {
  user?: UserInstance;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      message: 'Вы не вошли в систему! Пожалуйста, войдите в систему, чтобы получить доступ.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number };

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
