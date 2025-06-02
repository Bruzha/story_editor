// app/[type]/[id]/page.tsx
'use client';

import CreatePageMaket from '@/app/components/sections/create-page-maket/Create-page-maket';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { useAuth } from '@/app/AuthContext';
import { fetchItemData } from '@/app/store/thunks/fetchItemData';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { parseCookies } from 'nookies';
import { setItemId } from '@/app/store/reducers/itemReducer';
import { updateItemSuccess } from '@/app/store/reducers/itemReducer';
import Loading from '@/app/components/ui/loading/Loading';
import Message from '@/app/components/ui/message/Message';

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

  const { register, handleSubmit, setValue, reset } = useForm(); // Moved useForm outside the conditional block
  const { item, loading, error, characterName } = useSelector((state: RootState) => state.item);

  useEffect(() => {
    dispatch(setItemId(id));
  }, [id, type, dispatch]);

  useEffect(() => {
    reset();
  }, [item]);

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
    return <Loading />;
  }

  if (error) {
    return <Message title="ОШИБКА" message={error} />;
  }

  if (!item) {
    return <Message title="СООБЩЕНИЕ" message={'Данные по выбранному элементу отсутствуют.'} />;
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
              value={item.status}
              {...register('status')}
              onChange={(e) => {
                setValue('status', e.target.value);
                dispatch(updateItemSuccess({ ...item, status: e.target.value })); // Update Redux store
              }}
            />
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

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    console.log('Data submitted:', data);
    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];
    const apiUrl = `http://localhost:3001/update/update/${type}/${id}`;

    const masItemsData: any = item.info
      ? Object.keys(item.info).reduce((acc: any, key) => {
          acc[key] = { value: data[key] !== undefined ? data[key] : '' };
          return acc;
        }, {})
      : {};

    const payload: any = {
      info: masItemsData,
      status: data.status,
      markerColor: data.markerColor,
    };

    // Check if miniature was changed
    if (data.miniature) {
      const miniatureData = await convertFileToByteArray(data.miniature);
      payload.miniature = miniatureData;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedItem = await response.json();
      console.log('updatedItem:', updatedItem);
      console.log('Success:', updatedItem);

      dispatch(updateItemSuccess(updatedItem));
      dispatch(fetchItemData({ type, id }));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const convertFileToByteArray = (file: File): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = function (event) {
          if (event.target && event.target.result) {
            const arrayBuffer = event.target.result as ArrayBuffer;
            const byteArray = Array.from(new Uint8Array(arrayBuffer));
            resolve(byteArray);
          } else {
            reject(new Error('File reading error'));
          }
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.readAsArrayBuffer(file);
      } catch (e) {
        console.error('convertFileToByteArray', e);
        reject(e);
      }
    });
  };

  return (
    <div>
      <CreatePageMaket
        key={id}
        typeSidebar={item.typeSidebar}
        title={item.title}
        subtitle={getItemTitle()}
        masItems={
          item.info
            ? Object.entries(item.info).map(([key, value]) => {
                console.log('key:', key, 'value:', value);
                return {
                  key: key,
                  title: (value as any)?.title,
                  value: (value as any)?.value,
                  placeholder: (value as any)?.placeholder,
                  removable: (value as any)?.removable,
                };
              })
            : []
        }
        markerColor={item.markerColor || '#4682B4'}
        showCancelButton={true}
        showImageInput={item.showImageInput}
        register={register}
        setValue={setValue}
        onSubmit={handleSubmit(onSubmit)}
        src={item.src}
      >
        {renderCustomFields()}
        <Label text={'Дата создания'} id="created_date">
          <Input readOnly value={formatDate(item.createdAt)} />
        </Label>
        <Label text={'Дата обновления'} id="updated_date">
          <Input readOnly value={formatDate(item.updatedAt)} />
        </Label>
      </CreatePageMaket>
    </div>
  );
}
