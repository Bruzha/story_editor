import { Request, Response, NextFunction } from 'express';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ProjectFactory } from '../models/Project';
import { PlotLineFactory, PlotLineInstance } from '../models/PlotLine';

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
        data: [info?.name?.value || '', info?.description?.value || '', plotline.type],
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
