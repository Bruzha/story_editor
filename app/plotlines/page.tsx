import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    data: ['Сюжетная линия 1', 'Описание сюжетной линии 1'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    data: ['Сюжетная линия 1', 'Описание сюжетной линии 1'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    data: ['Сюжетная линия 1', 'Описание сюжетной линии 1'],
  },
];

export default function Plotlines() {
  return <CardsPageMaket typeSidebar="project" title="СЮЖЕТНЫЕ ЛИНИИ" subtitle="Проект 1" masItems={masData} />;
}
