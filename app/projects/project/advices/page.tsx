import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    data: ['Совет 1', 'Содержание совета 1'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    data: ['Совет 2', 'Содержание совета 2'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    data: ['Совет 3', 'Содержание совета 3'],
  },
];

export default function Advices() {
  return (
    <CardsPageMaket
      typeSidebar="help"
      title="СОВЕТЫ"
      subtitle="Проект 1"
      masItems={masData}
      showDeleteButton={false}
      showCreateButton={false}
    />
  );
}
