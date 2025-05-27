'use client';

import CreatePageMaket from '../../components/sections/create-page-maket/Create-page-maket';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';

interface ItemData {
  id: number;
  info?: any;
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  title: string;
  showImageInput?: boolean;
  [key: string]: any;
}

interface RouteParams {
  type: string;
  id: string;
  [key: string]: string;
}

export default function ItemInfoPage() {
  const { type, id } = useParams<RouteParams>();
  const [item, setItem] = useState<ItemData | null>(null);
  const dispatch = useDispatch();
  const projectId = useSelector((state: RootState) => state.project.projectId);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies['jwt'];

        if (!token) {
          console.error('Token not found in cookies');
          return;
        }

        let apiUrl = `http://localhost:3001/auth/${type}/${id}`;

        console.log('type: ' + type);
        console.log('id: ' + id);
        if (
          type === 'characters' ||
          type === 'locations' ||
          type === 'objects' ||
          type === 'groups' ||
          type === 'chapters' ||
          type === 'notes' ||
          type === 'plotlines' ||
          type === 'timelines'
        ) {
          if (!projectId) {
            console.error('projectId is not available in the store');
            return;
          }
          apiUrl = `http://localhost:3001/auth/projects/${projectId}/${type}/${id}`;
        } else if (type === 'supportingMaterials') {
          if (!projectId) {
            console.error('projectId is not available in the store');
            return;
          }
          apiUrl = `http://localhost:3001/auth/projects/${projectId}/${type}/${id}`;
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Error fetching item:', response.status, response.statusText);
          return;
        }

        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    if (type && id) {
      fetchItem();
    }
  }, [type, id, dispatch, projectId]);

  if (!item) {
    return <div>Loading...</div>;
  }

  const renderCustomFields = () => {
    // Здесь логика для отображения дополнительных полей, специфичных для каждого типа элемента
    if (type === 'projects') {
      return (
        <>
          <Label text={'Статус'} id="status">
            <Select
              options={[
                { value: 'запланирован', label: 'Запланирован' },
                { value: 'в процессе', label: 'В процессе' },
                { value: 'завершен', label: 'Завершен' },
                { value: 'приостановлен', label: 'Приостановлен' },
              ]}
              defaultValue={item.status}
            />
          </Label>
          <Label text={'Дата создания'} id="created_date">
            <Input readOnly value={formatDate(item.createdAt)} />
          </Label>
          <Label text={'Дата обновления'} id="updated_date">
            <Input readOnly value={formatDate(item.updatedAt)} />
          </Label>
        </>
      );
    }
    // Добавьте условия для других типов элементов
    return null;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getItemTitle = () => {
    if (item.info && item.info.name && item.info.name.value) {
      return item.info.name.value;
    } else if (item.info && item.info.title && item.info.title.value) {
      if (type === 'chapters') {
        return item.info.order.value + '. ' + item.info.title.value;
      }
      return item.info.title.value;
    }
    return `Информация о ${type.slice(0, -1)}`;
  };

  return (
    <div>
      <CreatePageMaket
        typeSidebar={item.typeSidebar}
        title={item.title}
        subtitle={getItemTitle()}
        masItems={
          item.info
            ? Object.entries(item.info).map(([key, value]) => ({
                key: key,
                title: (value as any)?.title,
                value: (value as any)?.value,
                placeholder: (value as any)?.placeholder,
                removable: (value as any)?.removable,
              }))
            : []
        }
        markerColor={item.markerColor}
        showCancelButton={true}
        showImageInput={item.showImageInput}
        onSubmit={() => console.log('Сохранение изменений')}
      >
        {renderCustomFields()}
      </CreatePageMaket>
    </div>
  );
}
