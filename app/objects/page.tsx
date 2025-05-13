import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Объект 1', 'Описание объекта 1', 'Тип'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Объект 1', 'Описание объекта 1', 'Тип'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Объект 1', 'Описание объекта 1', 'Тип'],
  },
];
export default function Objects() {
  return <CardsPageMaket typeSidebar="project" title="ОБЪЕКТЫ" subtitle="Проект 1" masItems={masData} />;
}
