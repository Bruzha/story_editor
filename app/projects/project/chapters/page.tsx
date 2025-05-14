import CardsPageMaket from '@/app/components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Глава 1', 'Название главы 1', 'Статус'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Глава 2', 'Название главы 2', 'Статус'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Глава 3', 'Название главы 3', 'Статус'],
  },
];

export default function Chapters() {
  return <CardsPageMaket typeSidebar="project" title="ГЛАВЫ" subtitle="Проект 1" masItems={masData} />;
}
