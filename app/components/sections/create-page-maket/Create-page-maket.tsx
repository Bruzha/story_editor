'use client';
import React, { useState, useEffect } from 'react';
import Maket from '../maket/Maket';
import Form from '../../ui/form/Form';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import Textarea from '../../ui/textarea/Textarea';
import Label from '../../ui/label/Label';
import Select from '../../ui/select/Select';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import './style.scss';

interface IProps {
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character';
  title: string;
  subtitle: string;
  masItems: {
    key: string;
    title: string;
    value?: any;
    placeholder?: string;
    removable?: boolean;
  }[];
  markerColor?: string;
  children?: React.ReactNode;
  showImageInput?: boolean;
  showMarkerColorInput?: boolean;
  showCancelButton?: boolean;
  showSaveExitButton?: boolean;
  handleCancelClick?: () => void;
  onSubmit: SubmitHandler<any>;
}

interface LabelProps {
  text: string;
  id?: string;
  children?: React.ReactNode;
}

export default function CreatePageMaket({
  typeSidebar,
  title,
  subtitle,
  masItems,
  markerColor = '#4682B4',
  children,
  showImageInput = false,
  showMarkerColorInput = true,
  showCancelButton = false,
  showSaveExitButton = false,
  handleCancelClick,
  onSubmit,
}: IProps) {
  const [, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: {},
    setValue,
  } = useForm({
    mode: 'onBlur',
  });

  const {} = useFieldArray({
    control,
    name: 'dynamicFields',
  });

  handleCancelClick = () => {
    router.back();
  };

  // Функция выбора миниатюры
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
    setValue('miniature', file); // Set the file value in react-hook-form
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

  const [selectOptions, setSelectOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const options = masItems.map((item) => ({
      value: `item_${item.key}`,
      label: item.title,
    }));
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Label) {
        const labelElement = child as React.ReactElement<LabelProps>;
        const labelText = labelElement.props.text;
        const labelId = labelElement.props.id || `child_${options.length}`;
        options.push({ label: labelText, value: labelId });
      }
    });

    if (showImageInput) {
      options.push({ label: 'Миниатюра', value: 'item_miniature' });
    }

    if (showMarkerColorInput) {
      options.push({ label: 'Маркерный цвет', value: 'item_marker_color' });
    }

    setSelectOptions(options);
  }, [masItems, children, showImageInput, showMarkerColorInput]);

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
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle} lineColor={markerColor}>
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
              <div className="create__line" style={{ backgroundColor: markerColor }}></div>
            </div>
            {masItems.map((item) => (
              <Label key={item.key} text={item.title} id={`item_${item.key}`}>
                <div className="create__textarea-container">
                  <Textarea key={item.key} name={item.title} defaultValue={item.value} placeholder={item.placeholder} />
                  <div>
                    <input
                      title="Добавить поле ниже"
                      className="create__button-textarea"
                      type="image"
                      src="/icons/add.svg"
                      alt="Добавить поле ниже"
                    />
                    {!item.removable && (
                      <input
                        title="Удалить поле"
                        className="create__button-textarea"
                        type="image"
                        src="/icons/delete.svg"
                        alt="Удалить поле"
                      />
                    )}
                    {/*
                    <input
                      title="Перетащить поле"
                      className="create__button-textarea"
                      type="image"
                      src="/icons/move.svg"
                      alt="Перетащить поле"
                    /> */}
                  </div>
                </div>
              </Label>
            ))}
            {children}
            {showImageInput && (
              <Label text={'Миниатюра'} id="item_miniature">
                <Input readOnly id="miniature_text" placeholder="Название выбранного файла" />
                <div className="create__input-file">
                  <Input type="file" isFileType={true} onChange={handleFileChange} />
                </div>
              </Label>
            )}
            {showMarkerColorInput && (
              <Label text={'Маркерный цвет'} id="item_marker_color">
                <Input type="color" defaultValue={markerColor} />
              </Label>
            )}
          </div>
          <div className="create__button">
            <Button type="submit" name={'Сохранить'} />
            {showCancelButton && <Button name={'Отмена'} onClick={handleCancelClick} />}
            {showSaveExitButton && <Button name={'Сохранить и выйти'} />}
          </div>
        </div>
      </Form>
    </Maket>
  );
}
