'use client';
import CreatePageMaket from '../../../components/sections/create-page-maket/Create-page-maket';
import masTitle from './data';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';

export default function CreateProject() {
  const option = [
    { value: '1', label: 'Запланирован' },
    { value: '2', label: 'В процессе' },
    { value: '3', label: 'Завершен' },
    { value: '4', label: 'Приостановлен' },
  ];
  return (
    <CreatePageMaket
      typeSidebar="project"
      title="ДАННЫЕ ПРОЕКТА"
      subtitle="Проект 1"
      masItems={masTitle}
      showCancelButton={false}
    >
      <Label text={'Статус'} id="status">
        <Select options={option} />
      </Label>
      <Label text={'Дата создания'} id="created_date">
        <Input readOnly value={'01.01.2024'} />
      </Label>
    </CreatePageMaket>
  );
}
