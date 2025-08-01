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
import { AppDispatch, RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import { setCharacterData, setMarkerColor, setMiniature } from '@/app/store/reducers/characterReducer';
import Image from 'next/image';

interface LabelProps {
  text: string;
  id?: string;
  children?: React.ReactNode;
}

interface IProps {
  typeSidebar: 'project' | 'profile' | 'timeline' | 'help' | 'create_character' | 'create_new_character' | '';
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
  src?: string | null;
  typePage?: string | null;
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
  typePage,
  src: initialSrc = null,
}: IProps) {
  const router = useRouter();

  handleCancelClick = () => {
    router.back();
  };
  const dispatch: AppDispatch = useDispatch();
  const [selectOptions, setSelectOptions] = useState<{ label: string; value: string }[]>([]);
  const [, setSelectedFileName] = useState<string>('');
  const [markerColor, setMarkerColorUse] = useState<string>(initialMarkerColor);
  const [src, setSrc] = useState<string | null>(initialSrc);
  const userRole = useSelector((state: RootState) => state.user.profile?.role);

  useEffect(() => {
    const options: { label: string; value: string }[] = [];

    if (showImageInput) {
      options.push({ label: 'Миниатюра', value: 'item_miniature' });
    }

    const masItemsOptions = masItems.map((item) => ({
      value: `item_${item.key}`,
      label: item.title,
    }));

    options.push(...masItemsOptions);
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === Label) {
        const labelElement = child as React.ReactElement<LabelProps>;
        const labelText = labelElement.props.text;
        const labelId = labelElement.props.id || `child_${options.length}`;
        options.push({ label: labelText, value: labelId });
      }
    });
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

        const createSelect = document.querySelector<HTMLElement>('.create__select');
        if (createSelect) {
          offset += createSelect.offsetHeight;
        }
        const subtitleContainer = document.querySelector<HTMLElement>('.maket__subtitle-container');
        if (subtitleContainer) {
          offset += subtitleContainer.offsetHeight;
        }

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
      const file = event.target.files?.[0];

      if (file) {
        setValue('miniature', file);
        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSrc(reader.result as string);
        };
        reader.readAsDataURL(file);

        if (typeSidebar === 'create_new_character') {
          const readerByteArray = new FileReader();
          readerByteArray.onload = (event: any) => {
            const arrayBuffer = event.target.result;
            if (arrayBuffer) {
              const uint8Array = new Uint8Array(arrayBuffer);
              dispatch(setMiniature(Array.from(uint8Array))); // Convert to byte array
            }
          };
          readerByteArray.readAsArrayBuffer(file);
        }
      } else {
        setValue('miniature', null);
        setSelectedFileName('');
        setSrc(null);
      }
    },
    [setValue, setSelectedFileName, setSrc, typeSidebar, dispatch]
  );

  useEffect(() => {
    masItems.forEach((item) => {
      if (item.value) {
        setValue(item.key, item.value);
      }
    });
  }, [masItems, setValue]);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeSidebar === 'create_new_character') {
      dispatch(setMarkerColor(e.target.value));
    }
    setMarkerColorUse(e.target.value);
    setValue('markerColor', e.target.value);
  };

  const handleTextareaChange = (itemKey: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (typePage) {
      let reduxTypePage = '';
      switch (typePage) {
        case 'characters':
          reduxTypePage = 'characters';
          break;
        case 'appearance':
          reduxTypePage = 'appearance';
          break;
        case 'personality':
          reduxTypePage = 'personality';
          break;
        case 'social':
          reduxTypePage = 'social';
          break;
        default:
          reduxTypePage = 'social';
          break;
      }
      dispatch(
        setCharacterData({
          typePage: reduxTypePage,
          data: { [itemKey]: { value: e.target.value } },
        })
      );
      setValue(itemKey, e.target.value);
    }
  };

  if (title === 'ДАННЫЕ СОВЕТА' || title === 'ДАННЫЕ ТЕРМИНА') {
    showMarkerColorInput = false;
    if (userRole === 'user') {
      typeSidebar = 'help';
    }
  }

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
            {showImageInput && (
              <Label text={'Миниатюра'} id="item_miniature">
                <div className="create__miniature-container">
                  <div>
                    {src && (
                      <Image className="create__miniatire-img" src={src} alt="Миниатюра" width={200} height={200} />
                    )}
                  </div>
                  <Input type="file" isFileType={true} onChange={handleFileChange} />
                </div>
              </Label>
            )}
            {masItems.map((item) => (
              <Label key={item.key} text={item.title} id={`item_${item.key}`}>
                <div className="create__textarea-container">
                  {userRole === 'user' && (title === 'ДАННЫЕ СОВЕТА' || title === 'ДАННЫЕ ТЕРМИНА') ? (
                    <p key={item.key}>{item.value}</p>
                  ) : typePage ? (
                    <Textarea
                      key={item.key}
                      placeholder={item.placeholder}
                      id={item.key}
                      onChange={handleTextareaChange(item.key)}
                      defaultValue={item.value}
                    />
                  ) : (
                    <Textarea key={item.key} placeholder={item.placeholder} {...register(item.key)} />
                  )}
                </div>
              </Label>
            ))}
            {children}
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
