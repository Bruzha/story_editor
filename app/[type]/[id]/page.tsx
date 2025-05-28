'use client';

import CreatePageMaket from '../../components/sections/create-page-maket/Create-page-maket';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { fetchItemData } from '@/app/store/thunks/fetchItemData';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/AuthContext';
import { setItemId } from '@/app/store/reducers/itemReducer';

interface RouteParams {
  type: string;
  id: string;
  [key: string]: string;
}

export default function ItemInfoPage() {
  const { type, id } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const typePage = searchParams.get('typePage');
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    dispatch(setItemId(id));
  }, [id, type, dispatch]);

  const { item, loading, error, characterName } = useSelector((state: RootState) => state.item);

  useEffect(() => {
    if (isAuthenticated) {
      if (type === 'characters') {
        dispatch(fetchItemData({ type, id, typePage: typePage || 'characters' }));
      } else {
        dispatch(fetchItemData({ type, id }));
      }
    } else {
      router.push('/auth/autorisation');
    }
  }, [type, id, typePage, dispatch, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>No item data available.</div>;
  }

  const renderCustomFields = () => {
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
    if (type === 'ideas') {
      return (
        <>
          <Label text={'Дата создания'} id="created_date">
            <Input readOnly value={formatDate(item.createdAt)} />
          </Label>
          <Label text={'Дата обновления'} id="updated_date">
            <Input readOnly value={formatDate(item.updatedAt)} />
          </Label>
        </>
      );
    }
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
    if (typePage === 'appearance' || typePage === 'personality' || typePage === 'social') {
      return characterName || 'Информация о персонаже';
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
