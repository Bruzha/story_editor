import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';

const masData = [
  {
    id: 0,
    src: '/icons/project1.svg',
    data: ['Персонаж 1', 'Описание персонажа 1', 'Роль', 'Раса', 'Возраст', 'Пол'],
    markColor: '#cc2336',
  },
  {
    id: 1,
    src: '/icons/project1.svg',
    data: ['Персонаж 2', 'Описание персонажа 2', 'Роль', 'Раса', 'Возраст', 'Пол'],
    markColor: '#a9e08d',
  },
  {
    id: 2,
    src: '/icons/project3.svg',
    data: ['Персонаж 3', 'Описание персонажа 3', 'Роль', 'Раса', 'Возраст', 'Пол'],
  },
];

export default function Characters() {
  return (
    <CardsPageMaket
      typeSidebar="project"
      title="ПЕРСОНАЖИ"
      subtitle="Проект 1"
      masItems={masData}
      createPageUrl="/create_character_base"
    />
  );
}
