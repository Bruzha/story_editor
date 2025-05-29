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
import masTitleCharacter from './masData/character';

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
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character' | '';
  projectId?: string;
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
    masTitle: masTitleLocation,
    typeSidebar: 'project',
  },
  {
    type: 'objects',
    title: 'СОЗДАНИЕ ОБЪЕКТА',
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
    masTitle: masTitleTimeEvent,
    typeSidebar: 'timeline',
  },
  {
    type: 'characters',
    title: 'СОЗДАНИЕ ПЕРСОНАЖА',
    masTitle: masTitleCharacter,
    typeSidebar: 'create_character',
  },
  // ... add more types
];

export default createPageData;
