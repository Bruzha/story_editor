'use client';

import CreatePageMaket from '@/app/components/sections/create-page-maket/Create-page-maket';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useAuth } from '@/app/AuthContext';
import { fetchCreatePageData } from '@/app/store/thunks/fetchCreatePageData';
import { createItem } from '@/app/store/thunks/createItem';
import { createGroupRelationships } from '@/app/store/thunks/createGroupRelationships';
import { fetchRelatedData } from '@/app/store/thunks/fetchRelatedData';
import { convertFileToByteArray } from '@/app/store/thunks/convertFileToByteArray';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Checkbox from '@/app/components/ui/checkbox/Checkbox';
import { useForm, SubmitHandler, FormProvider, useFormContext } from 'react-hook-form';
import Message from '@/app/components/ui/message/Message';
import Loading from '@/app/components/ui/loading/Loading';
import { setProjectId } from '@/app/store/reducers/projectReducer';
import Input from '@/app/components/ui/input/Input';
import { clearCharacterData } from '@/app/store/reducers/characterReducer';
import React, { ChangeEvent } from 'react';

interface RouteParams {
  type?: string;
  [key: string]: string | undefined;
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
  miniature?: File;
  status?: string;
  plotline_type?: string;
  markerColor?: string;
}

interface RelatedDataState {
  characters: Item[];
  locations: Item[];
  objects: Item[];
  time_events: Item[];
  chapters: Item[];
  relatedData: boolean;
}

interface CheckboxProps {
  label: string;
  value: string;
  fieldName: string;
}

const RelatedEntityCheckbox: React.FC<CheckboxProps> = ({ label, value, fieldName }) => {
  const { setValue, getValues } = useFormContext();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('value: ', value);
    const { checked } = event.target;
    const currentValue = getValues(fieldName) || [];
    let newValue: string[] = Array.isArray(currentValue) ? [...currentValue] : [];

    if (checked) {
      newValue = [...newValue, value];
    } else {
      newValue = newValue.filter((item) => item !== value);
    }

    setValue(fieldName, newValue);
  };

  return <Checkbox label={label} value={String(value)} onChange={handleChange} />;
};

function CreateItemPage() {
  const { type } = useParams<RouteParams>();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typePage = searchParams.get('typePage');

  const {
    createPageData,
    loading: createPageLoading,
    error: createPageError,
  } = useSelector((state: RootState) => state.createPage);

  const projectId = useSelector((state: RootState) => state.project.projectId);

  const { characters, appearance, personality, social, miniature, markerColor } = useSelector(
    (state: any) => state.character
  );
  console.log(
    'state.createPage: ',
    useSelector((state: RootState) => state.createPage)
  );
  const subtitle = useSelector((state: RootState) => state.cards.subtitle);

  const [relatedData, setRelatedData] = useState<RelatedDataState>({
    characters: [],
    locations: [],
    objects: [],
    time_events: [],
    chapters: [],
    relatedData: false,
  });
  const formMethods = useForm<FormValues>({
    defaultValues: {
      ...(createPageData?.masTitle?.reduce((acc: any, item) => {
        acc[item.key] = '';
        return acc;
      }, {}) || {}),
      ...characters,
      ...appearance,
      ...personality,
      ...social,
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: {},
  } = formMethods;

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && type) {
        const fetchParams: { type: string; typePage?: string } = { type: type };

        if (type === 'characters' && typePage) {
          fetchParams.typePage = typePage;
        }

        await dispatch(fetchCreatePageData(fetchParams));

        if (projectId) {
          await dispatch(fetchRelatedData({ type, projectId }));
        }
      } else if (!isAuthenticated) {
        router.push('/auth/autorisation');
      }
    };
    fetchData();
  }, [type, typePage, dispatch, isAuthenticated, router, projectId]);

  useEffect(() => {
    if (createPageData?.masTitle) {
      createPageData.masTitle.forEach((item: { key: string }) => {
        setValue(item.key, characters[item.key]?.value || '');
      });
    }
  }, [createPageData, characters, setValue]);

  useEffect(() => {
    const updateRelatedData = async () => {
      if (projectId && type) {
        const result = await dispatch(fetchRelatedData({ type, projectId }));
        if (fetchRelatedData.fulfilled.match(result)) {
          setRelatedData({
            characters: result.payload.characters || [],
            locations: result.payload.locations || [],
            objects: result.payload.objects || [],
            time_events: result.payload.timeEvents || [],
            chapters: result.payload.chapters || [],
            relatedData: result.payload.relatedData || false,
          });
        } else {
          console.error('Failed to fetch related data:', result.payload);
        }
      }
    };
    updateRelatedData();
  }, [dispatch, projectId, type]);

  const handleFormSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    console.log('data: ', data);
    if (!type) return;
    if (type === 'characters') {
      const payload: any = {
        info: {
          ...characters,
        },
        info_appearance: {
          ...appearance,
        },
        info_personality: {
          ...personality,
        },
        info_social: {
          ...social,
        },
        projectId: projectId,
        markerColor: markerColor,
        miniature: miniature,
      };

      if (miniature) {
        payload.miniature = miniature;
      }

      try {
        const createItemResult = await dispatch(createItem({ type: 'characters', payload }));
        if (createItem.fulfilled.match(createItemResult)) {
          const newItem = createItemResult.payload.newItem;

          const redirectUrl = `/characters/${newItem.id}/?typePage=characters`;
          dispatch(clearCharacterData());
          router.push(redirectUrl);
        } else {
          console.error('Error creating item', createItemResult.error);
        }
      } catch (error) {
        console.error('Error creating item', error);
      }
    } else {
      const formData =
        createPageData?.masTitle?.reduce((acc: any, item: { key: string | number }) => {
          acc[item.key] = { value: data[item.key] || '' };
          return acc;
        }, {}) || {};

      let customFields = {};
      if (type === 'projects' || type === 'chapters') {
        customFields = { status: data.status };
      }
      if (type === 'plotlines') {
        customFields = { type: data.plotline_type };
      }
      if (type === 'time_events') {
        customFields = { eventDate: data.time_events_eventDate };
      }

      const markerColor = data.markerColor || '#4682B4';

      let miniatureData: number[] | null = null;
      if (data.miniature) {
        const byteArrayResult = await dispatch(convertFileToByteArray({ file: data.miniature }));
        if (convertFileToByteArray.fulfilled.match(byteArrayResult)) {
          miniatureData = byteArrayResult.payload;
        } else {
          return;
        }
      }
      const payload = {
        info: formData,
        ...customFields,
        markerColor: markerColor,
        miniature: miniatureData,
        projectId: projectId,
        characterIds: data.characterIds,
        locationIds: data.locationIds,
        objectIds: data.objectIds,
        eventIds: data.eventIds,
        chapterIds: data.chapterIds,
      };

      console.log('payload', payload);
      const createItemResult = await dispatch(createItem({ type, payload }));
      if (createItem.fulfilled.match(createItemResult)) {
        const newItem = createItemResult.payload.newItem;

        const createRelationshipsResult = await dispatch(
          createGroupRelationships({ itemId: String(newItem.id), type: type, data })
        );
        if (!createGroupRelationships.fulfilled.match(createRelationshipsResult)) {
          console.error('Error creating relationships', createRelationshipsResult.error);
        }

        if (type === 'projects') {
          dispatch(setProjectId(String(newItem.id)));
        }
        const redirectUrl = `/${type}/${newItem.id}`;
        router.push(redirectUrl);
      } else {
        console.error('Error creating item', createItemResult.error);
      }
    }
  };

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
            />
          </Label>
        </>
      );
    }
    if (type === 'admin_terms' || type === 'user_terms') {
      return (
        <>
          <Label text={'Тип'} id="plotline_type">
            <Input readOnly value="Термин" />
          </Label>
        </>
      );
    }
    if (type === 'admin_advices' || type === 'user_advices') {
      return (
        <>
          <Label text={'Тип'} id="plotline_type">
            <Input readOnly value="Совет" />
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
              {...register('plotline_type')}
            />
          </Label>
        </>
      );
    }
    if (type === 'time_events') {
      return (
        <>
          <Label text={'Дата события'} id="time_events_eventDate">
            <Input type="datetime-local" {...register('time_events_eventDate')} />
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
            />
          </Label>
        </>
      );
    }
    return null;
  };

  const renderCheckboxes = () => {
    const checkboxes = [];

    if ((type === 'groups' || type === 'time_events') && relatedData.characters.length > 0) {
      checkboxes.push(
        <Label text="Персонажи" key="characters">
          {relatedData.characters.map((character) => (
            <RelatedEntityCheckbox
              key={character.id}
              label={character.title}
              value={String(character.id)}
              fieldName="characterIds"
            />
          ))}
        </Label>
      );
    }

    if ((type === 'groups' || type === 'time_events') && relatedData.locations.length > 0) {
      checkboxes.push(
        <Label text="Локации" key="locations">
          {relatedData.locations.map((location) => (
            <RelatedEntityCheckbox
              key={location.id}
              label={location.title}
              value={String(location.id)}
              fieldName="locationIds"
            />
          ))}
        </Label>
      );
    }

    if ((type === 'groups' || type === 'time_events') && relatedData.objects.length > 0) {
      checkboxes.push(
        <Label text="Объекты" key="objects">
          {relatedData.objects.map((object) => (
            <RelatedEntityCheckbox
              key={object.id}
              label={object.title}
              value={String(object.id)}
              fieldName="objectIds"
            />
          ))}
        </Label>
      );
    }

    if (type === 'time_events' && relatedData.chapters.length > 0) {
      console.log('relatedData.chapters: ', relatedData.chapters);
      checkboxes.push(
        <Label text="Главы" key="chapters">
          {relatedData.chapters.map((chapter) => (
            <RelatedEntityCheckbox
              key={chapter.id}
              label={chapter.title}
              value={String(chapter.id)}
              fieldName="chapterIds"
            />
          ))}
        </Label>
      );
    }

    if (type === 'chapters' && relatedData.time_events.length > 0) {
      checkboxes.push(
        <Label text="События линии времени, входящие в главу" key="time_events">
          {relatedData.time_events.map((event) => (
            <RelatedEntityCheckbox key={event.id} label={event.title} value={String(event.id)} fieldName="eventIds" />
          ))}
        </Label>
      );
    }

    return checkboxes.length > 0 ? <>{checkboxes}</> : null;
  };

  if (!isAuthenticated) {
    return null;
  }

  const masItems =
    createPageData?.masTitle?.map((item) => {
      let value = '';
      if (type === 'characters') {
        switch (typePage) {
          case 'characters':
            value = characters[item.key]?.value || '';
            break;
          case 'appearance':
            value = appearance[item.key]?.value || '';
            break;
          case 'personality':
            value = personality[item.key]?.value || '';
            break;
          case 'social':
            value = social[item.key]?.value || '';
            break;
          default:
            break;
        }
      }
      return {
        ...item,
        value: value,
      };
    }) || [];

  return (
    <FormProvider {...formMethods}>
      <div>
        {isAuthenticated && type && createPageData && relatedData.relatedData ? (
          <CreatePageMaket
            typeSidebar={createPageData.typeSidebar}
            title={createPageData.title}
            subtitle={subtitle}
            masItems={masItems}
            showImageInput={createPageData.showImageInput}
            showMarkerColorInput={createPageData.showMarkerColorInput}
            showCancelButton={true}
            register={register}
            setValue={setValue}
            onSubmit={handleSubmit(handleFormSubmit)}
            typePage={typePage}
          >
            {renderCustomFields()}
            {renderCheckboxes()}
          </CreatePageMaket>
        ) : (
          <div>
            {createPageLoading || !relatedData.relatedData ? (
              <Loading />
            ) : createPageError ? (
              <Message title={'ОШИБКА'} message={createPageError} />
            ) : (
              <Message title={'СООБЩЕНИЕ'} message={'Вы не авторизованы или нет подходящих данных'} />
            )}
          </div>
        )}
      </div>
    </FormProvider>
  );
}

export default CreateItemPage;
