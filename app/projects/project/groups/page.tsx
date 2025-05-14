import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Группа 1', 'Описание группы 1'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Группа 2', 'Описание группы 2'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Группа 2', 'Описание группы 2'],
  },
];

export default function Groups() {
  return <CardsPageMaket typeSidebar="project" title="ГРУППЫ" subtitle="Проект 1" masItems={masData} />;
}
