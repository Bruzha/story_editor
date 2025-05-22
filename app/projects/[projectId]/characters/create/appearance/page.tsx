import CreatePageMaket from '../../../../../components/sections/create-page-maket/Create-page-maket';
import masTitle from './data';
function F2() {
  console.log('Проект создан');
}
export default function CreateProject() {
  return (
    <CreatePageMaket
      typeSidebar="create_character"
      title="СОЗДАНИЕ ПЕРСОНАЖА"
      subtitle="Проект 1"
      masItems={masTitle}
      showMarkerColorInput={false}
      showCancelButton={false}
      showSaveExitButton={true}
      onSubmit={F2}
    />
  );
}
