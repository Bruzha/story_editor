'use client';

import CreatePageMaket from '../../components/sections/create-page-maket/Create-page-maket';
import masTitle from './data';

function F2() {
  console.log('Проект создан');
}
export default function CreateProject() {
  return (
    <CreatePageMaket
      typeSidebar="profile"
      title="СОЗДАНИЕ ИДЕИ"
      subtitle="Ruzhastik"
      masItems={masTitle}
      showCancelButton={true}
      onSubmit={F2}
    />
  );
}
