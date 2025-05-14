import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    data: ['Термин 1', 'Содержание термина 1'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    data: ['Термин 1', 'Содержание термина 1'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    data: ['Термин 1', 'Содержание термина 1'],
  },
];

export default function Terms() {
  return (
    <CardsPageMaket
      typeSidebar="help"
      title="СЛОВАРЬ ТЕРМИНОВ"
      subtitle="Проект 1"
      masItems={masData}
      showDeleteButton={false}
      showCreateButton={false}
    />
  );
}
