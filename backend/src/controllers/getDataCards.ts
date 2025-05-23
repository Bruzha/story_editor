import { Request, Response, NextFunction } from 'express';
import { DataTypes } from 'sequelize';
import { UserFactory, UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import { ProjectFactory, ProjectInstance, ProjectModel } from '../models/Project';
import { IdeaFactory, IdeaInstance } from '../models/Idea';
import { PlotLineFactory, PlotLineInstance } from '../models/PlotLine';

interface AuthRequest extends Request {
  user?: UserInstance;
}

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id; // ID пользователя

    const Project = ProjectFactory(sequelize, DataTypes) as any;
    const User = UserFactory(sequelize, DataTypes) as any;

    // Пользователь, которому принадлежат проекты
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const projects = await Project.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    const formattedProjects = projects.map((project: ProjectInstance) => {
      const info = project.info;
      return {
        id: project.id,
        src: '.',
        data: [
          info?.name?.value || 'Проект ' + project.id,
          info?.annotation?.value || '',
          info?.genre?.value || '',
          project.createdAt.toLocaleDateString(),
          project.status,
        ],
        markColor: project.markerColor,
      };
    });

    // Объект с возвращаемыми данными
    const responseData = {
      masItems: formattedProjects,
      typeSidebar: 'profile',
      typeCard: 'project',
      title: 'ПРОЕКТЫ',
      subtitle: user.username,
      createPageUrl: '/projects/create',
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

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

export const getPlotlines = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req, res, next);
  try {
    const { projectId } = req.params;
    const Plotline = PlotLineFactory(sequelize, DataTypes) as any;
    const Project = ProjectFactory(sequelize, DataTypes) as any;

    // Проект, которому принадлежат сюжетные линии
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const plotlines = await Plotline.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']],
    });
    const formattedPlotlines = plotlines.map((plotline: PlotLineInstance) => {
      const info = plotline.info;
      return {
        id: plotline.id,
        data: [info?.['title'], info?.['description'], plotline.type],
        markColor: plotline.markerColor,
      };
    });
    const responseData = {
      masItems: formattedPlotlines,
      typeSidebar: 'project',
      typeCard: 'plotline',
      title: 'СЮЖЕТНЫЕ ЛИНИИ',
      subtitle: project.info.title,
      createPageUrl: '/plotlines/create',
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Ошибка при получении сюжетных линий:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    console.log('getProjectById - projectId:', projectId);
    const Project = ProjectFactory(sequelize, DataTypes) as any;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction, projectId: any) => {
  try {
    // Убедитесь, что projectId предоставлен
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const userId = req.user!.id; // ID пользователя из middleware

    // Инициализируйте модель Project
    const Project = ProjectFactory(sequelize, DataTypes) as ProjectModel;

    // Попытайтесь найти проект с указанным ID и userId
    const project = await Project.findOne({
      where: {
        id: projectId,
        userId: userId,
      },
    });

    // Если проект не найден, верните ошибку
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    // Удалите проект
    await project.destroy();

    // Отправьте успешный ответ
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
