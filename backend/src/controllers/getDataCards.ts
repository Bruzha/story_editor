import { Request, Response, NextFunction } from 'express';
import { DataTypes } from 'sequelize';
import { UserInstance } from '../models/User';
import { sequelize } from '../config/database';
import { ProjectFactory, ProjectInstance } from '../models/Project';
import { IdeaFactory, IdeaInstance } from '../models/Idea';
import { PlotLineFactory, PlotLineInstance } from '../models/PlotLine';

interface AuthRequest extends Request {
  user?: UserInstance;
}

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthRequest).user!.id; // ID пользователя

    const Project = ProjectFactory(sequelize, DataTypes) as any;

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

    res.status(200).json(formattedProjects);
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

    res.status(200).json(formattedIdeas);
  } catch (error) {
    console.error('Ошибка при получении идей:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const getPlotlines = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const userId = (req as AuthRequest).user!.id; // ID пользователя
  //   const Plotline = PlotLineFactory(sequelize, DataTypes) as any;
  //   const plotlines = await Plotline.findAll({
  //     where: { userId },
  //     order: [['createdAt', 'DESC']],
  //   });
  //   const formattedPlotlines = plotlines.map((plotline: PlotLineInstance) => {
  //     const info = plotline.info;
  //     return {
  //       id: plotline.id,
  //       data: [info?.['title'], info?.['description'], plotline.type],
  //       markColor: plotline.markerColor,
  //     };
  //   });
  //   res.status(200).json(formattedPlotlines);
  // } catch (error) {
  //   console.error('Ошибка при получении сюжетных линий:', error);
  //   res.status(500).json({ message: 'Internal Server Error' });
  //   next(error);
  //}
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
