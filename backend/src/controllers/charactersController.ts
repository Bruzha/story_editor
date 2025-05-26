import { Request, Response, NextFunction } from 'express';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ProjectFactory } from '../models/Project';
import { CharacterFactory, CharacterInstance, CharacterModel } from '../models/Character';
import { UserInstance } from '../models/User';

interface AuthRequest extends Request {
  user?: UserInstance;
}

export const getСharacters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const Character = CharacterFactory(sequelize, DataTypes) as any;
    const Project = ProjectFactory(sequelize, DataTypes) as any;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const characters = await Character.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']],
    });

    const formattedCharacters = characters.map((character: CharacterInstance) => {
      const info = character.info_basic;
      return {
        id: character.id,
        src: '.',
        data: [
          info?.name?.value || '',
          info?.description?.value || '',
          info?.role?.value || '',
          info?.gender?.value || '',
          info?.age?.value || '',
          info?.race?.value || '',
        ],
        markColor: character.markerColor,
      };
    });
    const responseData = {
      masItems: formattedCharacters,
      typeSidebar: 'project',
      typeCard: 'character',
      title: 'ПЕРСОНАЖИ',
      subtitle: project.info.name.value, //  project.info_basic.name.title
      createPageUrl: '/characters/create',
    };
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Ошибка при получении персонажей:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const deleteCharacter = async (req: AuthRequest, res: Response, next: NextFunction, characterId: any) => {
  try {
    // Убедитесь, что characterId предоставлен
    if (!characterId) {
      return res.status(400).json({ message: 'Character ID is required' });
    }

    // Инициализируйте модель Character
    const Character = CharacterFactory(sequelize, DataTypes) as CharacterModel;

    // Попытайтесь найти персонажа с указанным ID
    const character = await Character.findOne({
      where: {
        id: characterId,
      },
    });

    // Если персонаж не найден, верните ошибку
    if (!character) {
      return res.status(404).json({ message: 'Character not found or unauthorized' });
    }

    // Удалите персонажа
    await character.destroy();

    // Отправьте успешный ответ
    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Ошибка при удалении персонажа:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
