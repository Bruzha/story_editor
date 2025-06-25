// app/[type]/[id]/page.tsx
'use client';

import CreatePageMaket from '@/app/components/sections/create-page-maket/Create-page-maket';
import { useEffect, useState, memo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useAuth } from '@/app/AuthContext';
import { fetchItemData } from '@/app/store/thunks/fetchItemData';
import { setItemId } from '@/app/store/reducers/itemReducer';
import Loading from '@/app/components/ui/loading/Loading';
import Message from '@/app/components/ui/message/Message';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Input from '@/app/components/ui/input/Input';
import { useForm, SubmitHandler, useFormContext, FormProvider } from 'react-hook-form';
import moment from 'moment';
import 'moment/locale/ru';
import { updateItem } from '@/app/store/thunks/updateItem';
import { convertFileToByteArray } from '@/app/store/thunks/convertFileToByteArray';
import { fetchRelatedData } from '@/app/store/thunks/fetchRelatedData';
import Checkbox from '@/app/components/ui/checkbox/Checkbox';
import React, { ChangeEvent } from 'react';
import { fetchExistingRelationships } from '@/app/store/thunks/fetchExistingRelationships';
import { updateRelationship } from '@/app/store/thunks/updateRelationship';

interface RouteParams {
  type: string;
  id: string;
  [key: string]: string;
}

interface Item {
  id: string;
  title: string;
}

interface FormValues {
  [key: string]: any;
  characterIds?: string[];
  locationIds?: string[];
  objectIds?: string[];
  eventIds?: string[];
  chapterIds?: string[];
}

interface RelatedDataState {
  characters: Item[];
  locations: Item[];
  objects: Item[];
  time_events: Item[];
  chapters: Item[];
}

interface RelatedEntityCheckboxProps {
  label: string;
  value: string;
  fieldName: string;
  isChecked: boolean;
}

interface ExistingRelationships {
  characterIds: string[];
  locationIds: string[];
  objectIds: string[];
  eventIds: string[];
  chapterIds: string[];
}

const RelatedEntityCheckbox: React.FC<RelatedEntityCheckboxProps> = ({ label, value, fieldName, isChecked }) => {
  const { setValue, getValues } = useFormContext();
  const [checked, setChecked] = React.useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked: eventChecked } = event.target;
    setChecked(eventChecked);
    const currentValue = getValues(fieldName) || [];
    let newValue: string[] = Array.isArray(currentValue) ? [...currentValue] : [];

    if (eventChecked) {
      newValue = [...newValue, value];
    } else {
      newValue = newValue.filter((item) => item !== value);
    }

    setValue(fieldName, newValue);
  };

  return <Checkbox label={label} name={fieldName} value={value} checked={checked} onChange={handleChange} />;
};

function ItemInfoPage() {
  const { type, id } = useParams<RouteParams>();
  const searchParams = useSearchParams();
  const typePage = searchParams.get('typePage');
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const projectId = useSelector((state: RootState) => state.project.projectId);
  const formMethods = useForm<FormValues>();

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>();
  const { item, loading, error, characterName } = useSelector((state: RootState) => state.item);

  const [relatedData, setRelatedData] = useState<RelatedDataState>({
    characters: [],
    locations: [],
    objects: [],
    time_events: [],
    chapters: [],
  });

  const [existingRelationships, setExistingRelationships] = useState<ExistingRelationships>({
    characterIds: [],
    locationIds: [],
    objectIds: [],
    eventIds: [],
    chapterIds: [],
  });

  useEffect(() => {
    dispatch(setItemId(id));
  }, [id, type, dispatch]);

  useEffect(() => {
    if (item) {
      const isoDate = item.eventDate ? moment(item.eventDate, 'DD.MM.YYYY, HH:mm').format('YYYY-MM-DDTHH:mm') : '';
      reset({ ...item, time_events_eventDate: isoDate });
    }
  }, [item, reset]);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        await dispatch(fetchItemData({ type, id, typePage: typePage || 'characters' }));

        let relatedDataResult;
        if (projectId) relatedDataResult = await dispatch(fetchRelatedData({ type, projectId }));

        if (fetchRelatedData.fulfilled.match(relatedDataResult)) {
          setRelatedData({
            characters: relatedDataResult.payload.characters || [],
            locations: relatedDataResult.payload.locations || [],
            objects: relatedDataResult.payload.objects || [],
            time_events: relatedDataResult.payload.timeEvents || [],
            chapters: relatedDataResult.payload.chapters || [],
          });
        } else {
          console.error('Failed to fetch related data');
        }
        const existingRelationshipsResult = await dispatch(fetchExistingRelationships({ type, id }));

        if (fetchExistingRelationships.fulfilled.match(existingRelationshipsResult)) {
          setExistingRelationships(existingRelationshipsResult.payload);
        } else {
          console.error('Failed to fetch existing relationships:', existingRelationshipsResult.payload);
        }
      } else {
        router.push('/auth/autorisation');
      }
    };

    fetchData();
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
                setValue('eventDate', e.target.value);
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

    const updateRelationships = async (
      relatedType: string,
      relatedIds: string[],
      addEndpoint: string,
      deleteEndpoint: string
    ) => {
      console.log('relatedIds: ', relatedIds);
      const key = (relatedType + 'Ids') as keyof ExistingRelationships;
      const existingRelationships = getExistingRelationships(key);
      const deleteAllPromises = existingRelationships.map(async (relatedId) => {
        await dispatch(
          updateRelationship({
            type: 'delete',
            endpoint: deleteEndpoint,
            itemId: id, // id - id текущего элемента страницы
            [relatedType + 'Id']: relatedId,
          })
        );
      });
      await Promise.all(deleteAllPromises);

      // Добавляем новые связи
      const addAllPromises = relatedIds.map(async (relatedId) => {
        await dispatch(
          updateRelationship({
            type: 'add',
            endpoint: addEndpoint,
            itemId: id,
            [relatedType + 'Id']: relatedId,
          })
        );
      });
      await Promise.all(addAllPromises);
    };

    console.log('data 3: ', data);
    if (type === 'groups') {
      await updateRelationships(
        'character',
        data.characterIds || [],
        '/groups/add-character',
        '/groups/delete-character'
      );

      await updateRelationships('location', data.locationIds || [], '/groups/add-location', '/groups/delete-location');

      await updateRelationships('object', data.objectIds || [], '/groups/add-object', '/groups/delete-object');
    } else if (type === 'timelines') {
      await updateRelationships(
        'character',
        data.characterIds || [],
        '/time_events/add-character',
        '/time_events/delete-character'
      );

      await updateRelationships(
        'location',
        data.locationIds || [],
        '/time_events/add-location',
        '/time_events/delete-location'
      );

      await updateRelationships(
        'object',
        data.objectIds || [],
        '/time_events/add-object',
        '/time_events/delete-object'
      );

      await updateRelationships(
        'chapter',
        data.chapterIds || [],
        '/time_events/add-chapter',
        '/time_events/delete-chapter'
      );
    } else if (type === 'chapters') {
      await updateRelationships('event', data.eventIds || [], '/chapters/add-timeEvent', '/chapters/delete-timeEvent');
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

  const getExistingRelationships = (fieldName: keyof ExistingRelationships): string[] => {
    return existingRelationships[fieldName] || [];
  };

  const renderCheckboxes = () => {
    const checkboxes: any[] = [];

    if ((type === 'groups' || type === 'time_events' || type === 'timelines') && relatedData.characters.length > 0) {
      checkboxes.push(
        <Label text="Персонажи" key="characters">
          {relatedData.characters.map((character) => {
            const isChecked = getExistingRelationships('characterIds').includes(String(character.id));
            return (
              <RelatedEntityCheckbox
                key={character.id}
                label={character.title}
                value={String(character.id)}
                fieldName="characterIds"
                isChecked={isChecked}
              />
            );
          })}
        </Label>
      );
    }

    if ((type === 'groups' || type === 'time_events' || type === 'timelines') && relatedData.locations.length > 0) {
      checkboxes.push(
        <Label text="Локации" key="locations">
          {relatedData.locations.map((location) => {
            const isChecked = getExistingRelationships('locationIds').includes(String(location.id));
            return (
              <RelatedEntityCheckbox
                key={location.id}
                label={location.title}
                value={String(location.id)}
                fieldName="locationIds"
                isChecked={isChecked}
              />
            );
          })}
        </Label>
      );
    }

    if ((type === 'groups' || type === 'time_events' || type === 'timelines') && relatedData.objects.length > 0) {
      checkboxes.push(
        <Label text="Объекты" key="objects">
          {relatedData.objects.map((object) => {
            const isChecked = getExistingRelationships('objectIds').includes(String(object.id));
            return (
              <RelatedEntityCheckbox
                key={object.id}
                label={object.title}
                value={String(object.id)}
                fieldName="objectIds"
                isChecked={isChecked}
              />
            );
          })}
        </Label>
      );
    }
    if (type === 'chapters' && relatedData.time_events.length > 0) {
      checkboxes.push(
        <Label text="События линии времени" key="time_events">
          {relatedData.time_events.map((event) => {
            const isChecked = getExistingRelationships('eventIds').includes(String(event.id));
            return (
              <RelatedEntityCheckbox
                key={event.id}
                label={event.title}
                value={String(event.id)}
                fieldName="eventIds"
                isChecked={isChecked}
              />
            );
          })}
        </Label>
      );
    }
    if ((type === 'time_events' || type === 'timelines') && relatedData.chapters.length > 0) {
      checkboxes.push(
        <Label text="Главы" key="chapters">
          {relatedData.chapters.map((chapter) => {
            const isChecked = getExistingRelationships('chapterIds').includes(String(chapter.id));
            return (
              <RelatedEntityCheckbox
                key={chapter.id}
                label={chapter.title}
                value={String(chapter.id)}
                fieldName="chapterIds"
                isChecked={isChecked}
              />
            );
          })}
        </Label>
      );
    }

    return checkboxes.length > 0 ? <>{checkboxes}</> : null;
  };

  return (
    <FormProvider {...formMethods}>
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
          markerColor={item.markerColor || '#4682B4'}
          showCancelButton={true}
          showImageInput={item.showImageInput}
          register={register}
          setValue={setValue}
          onSubmit={handleSubmit(onSubmit)}
          src={item.src}
        >
          {renderCustomFields()}
          {renderCheckboxes()}
          <Label text={'Дата создания'} id="created_date">
            <Input readOnly value={item.createdAt} />
          </Label>
          <Label text={'Дата обновления'} id="updated_date">
            <Input readOnly value={item.updatedAt} />
          </Label>
        </CreatePageMaket>
      </div>
    </FormProvider>
  );
}
export default memo(ItemInfoPage);
