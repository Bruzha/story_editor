import express, { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../middleware/authMiddleware';
import { IdeaFactory } from '../models/Idea';
import { ProjectFactory } from '../models/Project';
import { createItem, formatDate, getElementsForCopy } from '../controllers/commonController';
import { LocationFactory } from '../models/Location';
import { ObjectFactory } from '../models/Object';
import createPageData from '../data/createPageData';
import { CharacterFactory, CharacterInstance } from '../models/Character';
import { TimelineEventFactory } from '../models/TimelineEvent';
import { ChapterFactory } from '../models/Chapter';
import { GroupFactory } from '../models/Group';
import { NoteFactory } from '../models/Note';
import { PlotLineFactory } from '../models/PlotLine';
import { sequelize } from '../config/database';
import { DataTypes } from 'sequelize';
import { SupportingMaterialFactory } from '../models/SupportingMaterial';

const router: Router = express.Router();

type ProtectMiddleware = (req: Request, res: Response, next: NextFunction) => void;

router.get('/create-page-data/:type', protect as ProtectMiddleware, (req: Request, res: Response) => {
  const { type } = req.params;
  const { typePage } = req.query;

  console.log('Type create-page: ' + type, 'Type page:', typePage);

  let pageData;

  if (type === 'characters' && typePage) {
    pageData = createPageData.find((item) => item.type === type && item.typePage === typePage);
  } else {
    pageData = createPageData.find((item) => item.type === type);
  }
  console.log(pageData);
  if (pageData) {
    res.status(200).json(pageData);
  } else {
    res.status(404).json({ message: 'Create page data not found' });
  }
});

router.post('/create_item/projects', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Project', ProjectFactory).catch(next);
});
router.post('/create_item/ideas', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Idea', IdeaFactory).catch(next);
});
router.post('/create_item/locations', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Location', LocationFactory).catch(next);
});
router.post('/create_item/objects', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Object', ObjectFactory).catch(next);
});
router.post('/create_item/time_events', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'TimelineEvent', TimelineEventFactory).catch(next);
});
router.post('/create_item/chapters', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Chapter', ChapterFactory).catch(next);
});
router.post('/create_item/groups', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Group', GroupFactory).catch(next);
});
router.post('/create_item/notes', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'Note', NoteFactory).catch(next);
});
router.post('/create_item/plotlines', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'PlotLine', PlotLineFactory).catch(next);
});

router.post('/create_item/advices', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'SupportingMaterial', SupportingMaterialFactory, 'Совет').catch(next);
});
router.post('/create_item/terms', protect as ProtectMiddleware, (req, res, next) => {
  createItem(req, res, next, 'SupportingMaterial', SupportingMaterialFactory, 'Термин').catch(next);
});

router.post('/create_item/characters', protect as ProtectMiddleware, async (req, res, next) => {
  try {
    const { info, info_appearance, info_personality, info_social, miniature, markerColor, projectId } = req.body;
    const newCharacter = (await CharacterFactory(sequelize, DataTypes).create({
      projectId,
      info: info,
      info_appearance: info_appearance,
      info_personality: info_personality,
      info_social: info_social,
      miniature: miniature,
      markerColor: markerColor,
    })) as CharacterInstance; //  Явное приведение типа

    const characterData = newCharacter.get({ plain: true });

    // Преобразуем миниатюру в base64 строку
    let src: string | null = null;
    if (newCharacter.miniature) {
      const byteArray = newCharacter.miniature;
      const base64String = Buffer.from(byteArray).toString('base64');
      src = `data:image/png;base64,${base64String}`;
    }

    // Создаем новый объект, который будет содержать все свойства
    const formattedCharacter = {
      ...characterData,
      src: src,
      createdAt: formatDate(newCharacter.createdAt),
      updatedAt: formatDate(newCharacter.updatedAt),
    };

    console.log('formattedCharacter: ', formattedCharacter);
    res.status(201).json(formattedCharacter);
  } catch (error) {
    console.error('Error creating character:', error);
    next(error);
  }
});

router.get('/copy/elements/:type', protect as ProtectMiddleware, async (req, res, next) => {
  getElementsForCopy(req, res, next);
});

export default router;
