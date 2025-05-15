import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Проект 1', 'Описание проекта 1', 'Жанр', 'Дата создания', 'Статус'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Проект 2', 'Описание проекта 2', 'Жанр', 'Дата создания', 'Статус'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Проект 3', 'Описание проекта 3', 'Жанр', 'Дата создания', 'Статус'],
  },
];

export default function Projects() {
  return (
    <CardsPageMaket
      typeSidebar="profile"
      title="ПРОЕКТЫ"
      subtitle="Ruzhastik"
      masItems={masData}
      createPageUrl="/projects/create"
    />
  );
}
