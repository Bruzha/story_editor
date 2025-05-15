import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Локация 1', 'Описание локации 1', 'Тип'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Локация 2', 'Описание локации 2', 'Тип'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Локация 3', 'Описание локации 3', 'Тип'],
  },
];

export default function Locations() {
  return <CardsPageMaket typeSidebar="project" title="ЛОКАЦИИ" subtitle="Проект 1" masItems={masData} />;
}
