'use client';

import React, { useState } from 'react';
import Maket from '../maket/Maket';
import Textarea from '../../ui/textarea/Textarea';
import Label from '../../ui/label/Label';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import Form from '../../ui/form/Form';
import Select from '../../ui/select/Select';
import './style.scss';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface IProps {
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character';
  title: string;
  subtitle: string;
  masItems: {
    id: number;
    title: string;
    placeholder?: string;
    removable?: boolean;
  }[];
  showMarkerColorInput?: boolean;
  showCancelButton?: boolean;
  showSaveExitButton?: boolean;
  showImageInput?: boolean; // Добавили showImageInput
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Добавили handleFileChange
  children?: React.ReactNode;
}

interface FormData {
  [key: string]: string;
  markerColor: string;
}

// Определение интерфейса для пропсов Label
interface LabelProps {
  text: string;
  id?: string;
  children?: React.ReactNode;
}

export default function CreatePageMaket({
  typeSidebar,
  title,
  subtitle,
  masItems: initialMasItems,
  showMarkerColorInput = true,
  showCancelButton = true,
  showSaveExitButton = false,
  showImageInput = true, // Значение по умолчанию для showImageInput
  children,
}: IProps) {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();
  const [masItems, setMasItems] = useState(initialMasItems);

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Здесь будет логика отправки данных на сервер
  };

  const handleCancelClick = () => {
    router.back();
  };

  const selectOptions = masItems.map((item) => ({
    value: `item_${item.id}`,
    label: item.title,
  }));
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === Label) {
      const labelElement = child as React.ReactElement<LabelProps>;
      const labelText = labelElement.props.text;
      const labelId = labelElement.props.id || `child_${selectOptions.length}`;
      selectOptions.push({ label: labelText, value: labelId });
    }
  });
  if (showImageInput) {
    selectOptions.push({ label: 'Миниатюра', value: 'item_miniature' });
  }
  if (showMarkerColorInput) {
    selectOptions.push({ label: 'Маркерный цвет', value: 'item_marker_color' });
  }

  // Функция для удаления поля
  const handleDeleteItem = (id: number) => {
    setMasItems(masItems.filter((item) => item.id !== id));
  };

  // Функция выбора миниатюры
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        console.log('Выбранный файл:', file);
        // Получаем элемент по id, нужно указать, что он Input
        const miniatureText = document.getElementById('miniature_text') as HTMLInputElement;
        if (miniatureText) {
          miniatureText.value = file.name;
        }
      } else {
        alert('Пожалуйста, выберите изображение.'); // Выводим сообщение об ошибке
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
      }
    }
  };

  // Функция для прокрутки с учетом смещения
  const scrollToElement = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = () => {
        let offset = 0;

        // Элементы, которые могут быть sticky
        const createSelect = document.querySelector<HTMLElement>('.create__select');
        if (createSelect) {
          offset += createSelect.offsetHeight;
        }
        const subtitleContainer = document.querySelector<HTMLElement>('.maket__subtitle-container');
        if (subtitleContainer) {
          offset += subtitleContainer.offsetHeight;
        }

        // Учитывается Sidebar, если он sticky
        const isSidebarSticky = window.innerWidth < 768;
        const sidebar = document.querySelector<HTMLElement>('.sidebar');
        if (isSidebarSticky && sidebar) {
          offset += sidebar.offsetHeight;
        }
        return offset;
      };

      const elementPosition = element.getBoundingClientRect().top;
      let offsetPosition = elementPosition + window.pageYOffset - headerOffset();

      if (window.innerWidth < 420) {
        offsetPosition -= 7;
      }
      if (window.innerWidth >= 768) {
        offsetPosition -= 20;
      }

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="create">
          <div className="create__items">
            <div className="create__select">
              <Label text={'Быстрый поиск'}>
                <Select
                  options={selectOptions}
                  name="mySelect"
                  title="Вы можете быстро переместиться на нужное вам поле"
                  onChange={(e) => {
                    scrollToElement(e.target.value);
                  }}
                />
              </Label>
              <div className="create__line"></div>
            </div>
            {masItems.map((item) => (
              <Label key={item.id} text={item.title} id={`item_${item.id}`}>
                <div className="create__textarea-container">
                  <Textarea key={item.id} placeholder={item.placeholder} {...register(item.title)} />
                  <div>
                    <input
                      title="Добавить поле ниже"
                      className="create__button-textarea"
                      type="image"
                      src="/icons/add.svg"
                      alt="Добавить поле ниже"
                    />
                    <input
                      title="Удалить поле"
                      className="create__button-textarea"
                      type="image"
                      src="/icons/delete.svg"
                      alt="Удалить поле"
                      onClick={() => handleDeleteItem(item.id)}
                    />
                    <input
                      title="Перетащить поле"
                      className="create__button-textarea"
                      type="image"
                      src="/icons/move.svg"
                      alt="Перетащить поле"
                    />
                  </div>
                </div>
              </Label>
            ))}
            {children}
            {showImageInput && (
              <Label text={'Миниатюра'} id="item_miniature">
                <Input readOnly id="miniature_text" />
                <div className="create__input-file">
                  <Input type="file" isFileType={true} onChange={handleFileChange} />
                </div>
              </Label>
            )}
            {showMarkerColorInput && (
              <Label text={'Маркерный цвет'} id="item_marker_color">
                <Input type="color" defaultValue="#4682B4" />
              </Label>
            )}
          </div>
          <div className="create__button">
            <Button name={'Добавить поле'} />
            <Button type="submit" name={'Сохранить'} />
            {showCancelButton && <Button name={'Отмена'} onClick={handleCancelClick} />}
            {showSaveExitButton && <Button name={'Сохранить и выйти'} />}
          </div>
        </div>
      </Form>
    </Maket>
  );
}
