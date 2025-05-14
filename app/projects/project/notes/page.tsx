import CardsPageMaket from '../../../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    data: ['Заметка 1', 'Содержание заметки 1', 'Дата создания'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    data: ['Заметка 2', 'Содержание заметки 2', 'Дата создания'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    data: ['Заметка 2', 'Содержание заметки 2', 'Дата создания'],
  },
];

export default function Notes() {
  return <CardsPageMaket typeSidebar="project" title="ЗАМЕТКИ" subtitle="Проект 1" masItems={masData} />;
}
