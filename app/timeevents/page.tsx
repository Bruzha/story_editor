import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Событие 1', 'Описание события 1', 'Дата'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Событие 1', 'Описание события 1', 'Дата'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Событие 1', 'Описание события 1', 'Дата'],
  },
];

export default function TimeEvents() {
  return <CardsPageMaket typeSidebar="timeline" title="СПИСОК СОБЫТИЙ" subtitle="Проект 1" masItems={masData} />;
}
