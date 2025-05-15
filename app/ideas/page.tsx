import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    data: ['Идея 1', 'Описание идеи 1', 'Дата создания'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    data: ['Идея 2', 'Описание идеи 2', 'Дата создания'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    data: ['Идея 3', 'Описание идеи 3', 'Дата создания'],
  },
];

export default function Ideas() {
  return <CardsPageMaket typeSidebar="profile" title="ИДЕИ" subtitle="Ruzhastik" masItems={masData} />;
}
