import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    data: ['Схема отношений 1'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    data: ['Схема отношений 2'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    data: ['Схема отношений 3'],
  },
];
export default function Relationships() {
  return <CardsPageMaket typeSidebar="project" title="СХЕМЫ ОТНОШЕНИЙ" subtitle="Проект 1" masItems={masData} />;
}
