// components/sections/create-page-maket/Create-page-maket.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Maket from '../maket/Maket';
import Form from '../../ui/form/Form';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import Textarea from '../../ui/textarea/Textarea';
import Label from '../../ui/label/Label';
import Select from '../../ui/select/Select';
import { SubmitHandler, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import './style.scss';
import { ChangeEvent } from 'react';

interface LabelProps {
  text: string;
  id?: string;
  children?: React.ReactNode;
}

interface IProps {
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character' | '';
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
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSubmit: SubmitHandler<any>;
}

export default function CreatePageMaket({
  typeSidebar,
  title,
  subtitle,
  masItems,
  markerColor: initialMarkerColor = '#4682B4',
  children,
  showImageInput = false,
  showMarkerColorInput = true,
  showCancelButton = false,
  showSaveExitButton = false,
  handleCancelClick,
  register,
  setValue,
  onSubmit,
}: IProps) {
  const router = useRouter();

  handleCancelClick = () => {
    router.back();
  };

  const [selectOptions, setSelectOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>(''); // Add state for selected file name
  const [markerColor, setMarkerColor] = useState<string>(initialMarkerColor);

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

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setValue('miniature', file); // Set the file value using setValue
        setSelectedFileName(file.name); // Update the selected file name
      } else {
        setSelectedFileName(''); // Clear the selected file name if no file is selected
      }
    },
    [setValue, setSelectedFileName]
  );

  useEffect(() => {
    masItems.forEach((item) => {
      if (item.value) {
        setValue(item.key, item.value);
      }
    });
  }, [masItems, setValue]);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMarkerColor(e.target.value);
    setValue('markerColor', e.target.value);
  };

  return (
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle} lineColor={markerColor}>
      <Form onSubmit={onSubmit}>
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
                  <Textarea
                    key={item.key}
                    placeholder={item.placeholder}
                    {...register(item.key)} // Use register here
                  />
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
                  </div>
                </div>
              </Label>
            ))}
            {children}
            {showImageInput && (
              <Label text={'Миниатюра'} id="item_miniature">
                <Input
                  readOnly
                  id="miniature_text"
                  placeholder="Название выбранного файла"
                  value={selectedFileName} // Display the selected file name
                />
                <div className="create__input-file">
                  <Input type="file" isFileType={true} onChange={handleFileChange} />
                </div>
              </Label>
            )}
            {showMarkerColorInput && (
              <Label text={'Маркерный цвет'} id="item_marker_color">
                <Input type="color" value={markerColor} {...register('markerColor')} onChange={handleColorChange} />
              </Label>
            )}
          </div>
          <div className="create__button">
            <Button type="submit" name={'Сохранить'} />
            {showCancelButton && <Button name={'Назад'} onClick={handleCancelClick} />}
            {showSaveExitButton && <Button name={'Сохранить и выйти'} />}
          </div>
        </div>
      </Form>
    </Maket>
  );
}
