import CreatePageMaket from '../components/sections/create-page-maket/Create-page-maket';
import masTitle from './data';

export default function CreateProject() {
  return <CreatePageMaket typeSidebar="profile" title="СОЗДАНИЕ ПРОЕКТА" subtitle="Ruzhastik" masItems={masTitle} />;
}
