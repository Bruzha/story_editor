// backend/src/routes/exportRoutes.ts
import express, { NextFunction, Request, Response, Router } from 'express';
import { ProjectFactory } from '../models/Project';
import { ChapterFactory } from '../models/Chapter';
import { protect } from '../middleware/authMiddleware';
import { sequelize } from '../config/database';
import { DataTypes } from 'sequelize';
import { CharacterFactory } from '../models/Character';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import { PlotLineFactory } from '../models/PlotLine';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { GroupFactory } from '../models/Group';
import { NoteFactory } from '../models/Note';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

router.get(
  '/projectData/:projectId',
  protect as ProtectMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;

      const Project = ProjectFactory(sequelize, DataTypes);
      const Chapter = ChapterFactory(sequelize, DataTypes);
      const Character = CharacterFactory(sequelize, DataTypes);
      const Location = LocationFactory(sequelize, DataTypes);
      const Object = ObjectFactory(sequelize, DataTypes);
      const PlotLine = PlotLineFactory(sequelize, DataTypes);
      const TimeEvent = TimelineEventFactory(sequelize, DataTypes);
      const Group = GroupFactory(sequelize, DataTypes);
      const Note = NoteFactory(sequelize, DataTypes);

      const project = await Project.findByPk(projectId);

      if (!project) {
        return next(new Error('Project not found')); // Use next() for errors
      }

      const characters = await Character.findAll({ where: { projectId } });
      const locations = await Location.findAll({ where: { projectId } });
      const chapters = await Chapter.findAll({ where: { projectId } });
      const objects = await Object.findAll({ where: { projectId } });
      const plotLines = await PlotLine.findAll({ where: { projectId } });
      const timeEvents = await TimeEvent.findAll({ where: { projectId } });
      const groups = await Group.findAll({ where: { projectId } });
      const notes = await Note.findAll({ where: { projectId } });
      // Fetch other entities similarly
      console.log(
        'Notes data:',
        notes.map((note) => note.get())
      );
      const projectData = {
        project: project.get(),
        characters: characters.map((char) => char.get()),
        locations: locations.map((loc) => loc.get()),
        chapters: chapters.map((chap) => chap.get()),
        objects: objects.map((obj) => obj.get()),
        plotLines: plotLines.map((plot) => plot.get()),
        timeEvents: timeEvents.map((event) => event.get()),
        groups: groups.map((group) => group.get()),
        notes: notes.map((note) => note.get()),
        // Add other entities to the data
      };

      res.json(projectData);
    } catch (error) {
      console.error('Error fetching project data for export:', error);
      next(error); // Pass the error to the next middleware
    }
  }
);

export default router;
