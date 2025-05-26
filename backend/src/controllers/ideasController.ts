import { Request, Response, NextFunction } from 'express';
import { DataTypes } from 'sequelize';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import { IdeaFactory, IdeaInstance } from '../models/Idea';

interface AuthRequest extends Request {
  user?: UserInstance;
}

export const getIdeas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id; // ID пользователя

    const Idea = IdeaFactory(sequelize, DataTypes) as any;
    const User = UserFactory(sequelize, DataTypes) as any;

    // Пользователь, которому принадлежат идеи
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ideas = await Idea.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    const formattedIdeas = ideas.map((idea: IdeaInstance) => {
      const info = idea.info;
      return {
        id: idea.id,
        data: [
          info?.name?.value || 'Идея ' + idea.id,
          info?.description?.value || '',
          idea.createdAt.toLocaleDateString(),
        ],
        markColor: idea.markerColor,
      };
    });

    const responseData = {
      masItems: formattedIdeas,
      typeSidebar: 'profile',
      typeCard: 'idea',
      title: 'ИДЕИ',
      subtitle: user.username,
      createPageUrl: '/ideas/create',
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Ошибка при получении идей:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
