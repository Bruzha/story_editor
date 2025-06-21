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
import { setItemId } from '@/app/store/reducers/itemReducer';
import { updateItem } from '@/app/store/thunks/updateItem';
import Loading from '@/app/components/ui/loading/Loading';
import Message from '@/app/components/ui/message/Message';
import { convertFileToByteArray } from '@/app/store/thunks/convertFileToByteArray';
import moment from 'moment';

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

  const { register, handleSubmit, setValue, reset } = useForm();
  const { item, loading, error, characterName } = useSelector((state: RootState) => state.item);

  useEffect(() => {
    dispatch(setItemId(id));
  }, [id, type, dispatch]);

  useEffect(() => {
    if (item) {
      // Преобразуем eventDate в формат ISO 8601 перед установкой значения по умолчанию
      const isoDate = item.eventDate ? moment(item.eventDate, 'DD.MM.YYYY, HH:mm').format('YYYY-MM-DDTHH:mm') : '';
      reset({ ...item, time_events_eventDate: isoDate }); // Устанавливаем значение по умолчанию для time_events_eventDate
    }
  }, [item, reset]);

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
              {...register('status')}
              onChange={(e) => {
                setValue('status', e.target.value);
              }}
            />
          </Label>
        </>
      );
    }
    if (type === 'plotlines') {
      return (
        <>
          <Label text={'Тип'} id="plotline_type">
            <Select
              options={[
                { value: 'главная', label: 'Главная' },
                { value: 'второстепенная', label: 'Второстепенная' },
                { value: 'равнозначная', label: 'Равнозначная' },
              ]}
              {...register('type')}
              onChange={(e) => {
                setValue('type', e.target.value);
              }}
            />
          </Label>
        </>
      );
    }
    if (type === 'time_events' || type === 'timelines') {
      return (
        <>
          <Label text={'Дата события'} id="time_events_eventDate">
            <Input
              type="datetime-local"
              {...register('time_events_eventDate')}
              onChange={(e) => {
                setValue('eventDate', e.target.value); // Обновляем значение в форме
              }}
            />
          </Label>
        </>
      );
    }
    if (type === 'chapters') {
      return (
        <>
          <Label text={'Статус'} id="status">
            <Select
              options={[
                { value: 'запланирована', label: 'Запланирована' },
                { value: 'в процессе', label: 'В процессе' },
                { value: 'завершена', label: 'Завершена' },
                { value: 'приостановлена', label: 'Приостановлена' },
              ]}
              {...register('status')}
              onChange={(e) => {
                setValue('status', e.target.value);
              }}
            />
          </Label>
        </>
      );
    }
    return null;
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
    return 'Информация об элементе';
  };

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    const masItemsData: any = item.info
      ? Object.keys(item.info).reduce((acc: any, key) => {
          acc[key] = { value: data[key] !== undefined ? data[key] : '' };
          return acc;
        }, {})
      : {};

    let info = null;
    let info_appearance = null;
    let info_personality = null;
    let info_social = null;

    if (type === 'characters') {
      switch (typePage) {
        case 'characters':
          info = masItemsData;
          break;
        case 'appearance':
          info_appearance = masItemsData;
          break;
        case 'personality':
          info_personality = masItemsData;
          break;
        case 'social':
          info_social = masItemsData;
          break;
        default:
          break;
      }
    } else {
      info = masItemsData;
    }
    dispatch(
      updateItem({
        type,
        id,
        data: {
          info: info,
          info_appearance: info_appearance,
          info_personality: info_personality,
          info_social: info_social,
          status: data.status,
          type: data.type,
          eventDate: data.time_events_eventDate,
          markerColor: data.markerColor,
        },
        miniature: data.miniature,
        convertFileToByteArray: async (file: File) => {
          const result = await dispatch(convertFileToByteArray({ file }));
          return result.payload as number[];
        },
      })
    );
  };

  return (
    <div>
      <CreatePageMaket
        key={id}
        typeSidebar={item.typeSidebar}
        title={item.title}
        subtitle={getItemTitle()}
        typePage={typePage}
        masItems={
          item.info
            ? Object.entries(item.info).map(([key, value]) => {
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
        markerColor={item.markerColor || '#4682B4'} // Передаем markerColor
        showCancelButton={true}
        showImageInput={item.showImageInput}
        register={register}
        setValue={setValue}
        onSubmit={handleSubmit(onSubmit)}
        src={item.src} // Передаем src
      >
        {renderCustomFields()}
        <Label text={'Дата создания'} id="created_date">
          <Input readOnly value={item.createdAt} />
        </Label>
        <Label text={'Дата обновления'} id="updated_date">
          <Input readOnly value={item.updatedAt} />
        </Label>
      </CreatePageMaket>
    </div>
  );
}
