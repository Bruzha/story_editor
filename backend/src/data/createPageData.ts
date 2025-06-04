// data/createPageData.ts:
import masTitleProject from './masData/project';
import masTitleIdea from './masData/idea';
import masTitlPlotline from './masData/plotline';
import masTitleLocation from './masData/location';
import masTitleObject from './masData/object';
import masTitleGroup from './masData/group';
import masTitleChapter from './masData/chapter';
import masTitleNote from './masData/note';
import masTitleTimeEvent from './masData/timeevent';
import {
  masTitleCharacter,
  masTitleCharacterAppearance,
  masTitleCharacterPersonality,
  masTitleCharacterSocial,
} from './masData/character';

interface MasTitleItem {
  key: string;
  title: string;
  placeholder?: string;
  removable?: boolean;
}

interface CreatePageDataType {
  type: string;
  title: string;
  masTitle: MasTitleItem[];
  showImageInput?: boolean;
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character' | 'create_new_character' | '';
  projectId?: string;
  typePage?: 'characters' | 'appearance' | 'personality' | 'social';
}

const createPageData: CreatePageDataType[] = [
  {
    type: 'projects',
    title: 'СОЗДАНИЕ ПРОЕКТА',
    masTitle: masTitleProject,
    showImageInput: true,
    typeSidebar: 'profile',
  },
  {
    type: 'ideas',
    title: 'СОЗДАНИЕ ИДЕИ',
    masTitle: masTitleIdea,
    typeSidebar: 'profile',
  },
  {
    type: 'plotlines',
    title: 'СОЗДАНИЕ СЮЖЕТНОЙ ЛИНИИ',
    masTitle: masTitlPlotline,
    typeSidebar: 'project',
  },
  {
    type: 'locations',
    title: 'СОЗДАНИЕ ЛОКАЦИИ',
    showImageInput: true,
    masTitle: masTitleLocation,
    typeSidebar: 'project',
  },
  {
    type: 'objects',
    title: 'СОЗДАНИЕ ОБЪЕКТА',
    showImageInput: true,
    masTitle: masTitleObject,
    typeSidebar: 'project',
  },
  {
    type: 'groups',
    title: 'СОЗДАНИЕ ГРУППЫ',
    masTitle: masTitleGroup,
    typeSidebar: 'project',
  },
  {
    type: 'chapters',
    title: 'СОЗДАНИЕ ГЛАВЫ',
    showImageInput: true,
    masTitle: masTitleChapter,
    typeSidebar: 'project',
  },
  {
    type: 'notes',
    title: 'СОЗДАНИЕ ЗАМЕТКИ',
    masTitle: masTitleNote,
    typeSidebar: 'project',
  },
  {
    type: 'time_events',
    title: 'СОЗДАНИЕ СОБЫТИЯ',
    showImageInput: true,
    masTitle: masTitleTimeEvent,
    typeSidebar: 'timeline',
  },
  {
    type: 'characters', // Общий type для всех этапов персонажа
    title: 'Основная информация',
    masTitle: masTitleCharacter,
    showImageInput: true,
    typeSidebar: 'create_new_character',
    typePage: 'characters', // Указываем typePage
  },
  {
    type: 'characters', // Общий type для всех этапов персонажа
    title: 'Внешность',
    masTitle: masTitleCharacterAppearance,
    showImageInput: true,
    typeSidebar: 'create_new_character',
    typePage: 'appearance', // Указываем typePage
  },
  {
    type: 'characters', // Общий type для всех этапов персонажа
    title: 'Личность',
    masTitle: masTitleCharacterPersonality,
    showImageInput: true,
    typeSidebar: 'create_new_character',
    typePage: 'personality', // Указываем typePage
  },
  {
    type: 'characters', // Общий type для всех этапов персонажа
    title: 'Социальные связи',
    masTitle: masTitleCharacterSocial,
    showImageInput: true,
    typeSidebar: 'create_new_character',
    typePage: 'social', // Указываем typePage
  },
];

export default createPageData;
