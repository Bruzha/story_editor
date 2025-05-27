import { Request, Response, NextFunction } from 'express';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ProjectFactory } from '../models/Project';

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

export { ProjectFactory };
