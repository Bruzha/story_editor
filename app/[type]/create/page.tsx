// app/[type]/create/page.tsx
'use client';

import CreatePageMaket from '@/app/components/sections/create-page-maket/Create-page-maket';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { useAuth } from '@/app/AuthContext';
import { fetchCreatePageData } from '@/app/store/thunks/fetchCreatePageData';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import Checkbox from '@/app/components/ui/checkbox/Checkbox'; // Импортируем компонент чекбокса
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { parseCookies } from 'nookies';
import Message from '@/app/components/ui/message/Message';
import Loading from '@/app/components/ui/loading/Loading';
import { setProjectId } from '@/app/store/reducers/projectReducer';

interface RouteParams {
  type?: string;
  [key: string]: string | undefined;
}

interface Item {
  id: string; // Убедитесь, что тип ID соответствует вашим данным
  title: string; // или name, в зависимости от ваших данных
}

interface FormValues {
  [key: string]: any; // Или более конкретные типы, если известно
  characterIds?: string[];
  locationIds?: string[];
  objectIds?: string[];
  // Другие поля формы
  miniature?: File; //  Укажите тип File
}

export default function CreateItemPage() {
  const { type } = useParams<RouteParams>();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { createPageData, loading } = useSelector((state: RootState) => state.createPage);
  const subtitle = useSelector((state: RootState) => state.posts.subtitle);
  // const posts = useSelector((state: RootState) => state.posts); // Удалено, так как не используется
  const projectId = useSelector((state: RootState) => state.project.projectId);

  // Добавим состояния для хранения данных
  const [characters, setCharacters] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Item[]>([]);
  const [objects, setObjects] = useState<Item[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { defaultValues },
  } = useForm<FormValues>({
    defaultValues: {
      characterIds: [],
      locationIds: [],
      objectIds: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && type && projectId) {
        dispatch(fetchCreatePageData({ type: type }));
        await fetchRelatedData();
      } else if (!isAuthenticated) {
        router.push('/auth/autorisation');
      }
    };
    fetchData();
  }, [type, dispatch, isAuthenticated, router, projectId]);

  // Функция для получения данных из БД
  const fetchRelatedData = async () => {
    if (!projectId || !type) return;
    try {
      const token = parseCookies()['jwt'];
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const charactersResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/characters`, {
        headers,
      });
      const locationsResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/locations`, {
        headers,
      });
      const objectsResponse = await fetch(`http://localhost:3001/getCards/projects/${projectId}/objects`, { headers });

      if (!charactersResponse.ok || !locationsResponse.ok || !objectsResponse.ok) {
        throw new Error('Failed to fetch related data');
      }

      const charactersData = await charactersResponse.json();
      const locationsData = await locationsResponse.json();
      const objectsData = await objectsResponse.json();

      // Преобразуем данные, извлекая только id и title
      const charactersForCheckboxes = charactersData.masItems.map((item: any) => ({
        id: item.id,
        title: item.data[0], //  Предполагается, что title находится в data[0]
      }));
      const locationsForCheckboxes = locationsData.masItems.map((item: any) => ({
        id: item.id,
        title: item.data[0], //  Предполагается, что title находится в data[0]
      }));
      const objectsForCheckboxes = objectsData.masItems.map((item: any) => ({
        id: item.id,
        title: item.data[0], //  Предполагается, что title находится в data[0]
      }));

      setCharacters(charactersForCheckboxes);
      setLocations(locationsForCheckboxes);
      setObjects(objectsForCheckboxes);
    } catch (error) {
      console.error('Error fetching related data:', error);
      // Обработайте ошибку (например, установите сообщение об ошибке)
    }
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    if (!type) return;

    const formData =
      createPageData?.masTitle?.reduce((acc: any, item) => {
        acc[item.key] = { value: data[item.key] || '' };
        return acc;
      }, {}) || {};

    let customFields = {};
    if (type === 'projects') {
      customFields = { status: data.status };
    }
    if (type === 'plotlines') {
      customFields = { type: data.plotline_type }; // Assuming 'plotline_type' is the name of the select field
    }

    const markerColor = data.markerColor || '#4682B4';

    let miniatureData = null;
    if (data.miniature) {
      miniatureData = await convertFileToByteArray(data.miniature);
    }

    const payload = {
      info: formData,
      ...customFields,
      markerColor: markerColor,
      miniature: miniatureData,
      projectId: projectId,
      // Добавляем выбранные элементы в payload
      characterIds: data.characterIds,
      locationIds: data.locationIds,
      objectIds: data.objectIds,
    };

    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];

    const apiUrl = `http://localhost:3001/create/create_item/${type}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newItem = await response.json();

      // Создаем связи в связующих таблицах после успешного создания Group
      await createGroupRelationships(newItem.id, data);

      if (type === 'projects') {
        dispatch(setProjectId(String(newItem.id)));
      }
      const redirectUrl = `/${type}/${newItem.id}`;
      router.push(redirectUrl);
    } catch (error: any) {
      console.error('Error creating item:', error);
      // Обработайте ошибку (например, установите сообщение об ошибке)
      return <Message title={'ОШИБКА'} message={`Ошибка создания элемента: ${error.message}`} />;
    }
  };
  const createGroupRelationships = async (groupId: string, data: FormValues) => {
    const token = parseCookies()['jwt'];
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Создаем запросы для добавления связей
    const characterPromises =
      data.characterIds?.map((characterId: string) =>
        fetch('http://localhost:3001/create/groups/add-character', {
          method: 'POST',
          headers,
          body: JSON.stringify({ groupId, characterId }),
        })
      ) || [];

    const locationPromises =
      data.locationIds?.map((locationId: string) =>
        fetch('http://localhost:3001/create/groups/add-location', {
          method: 'POST',
          headers,
          body: JSON.stringify({ groupId, locationId }),
        })
      ) || [];

    const objectPromises =
      data.objectIds?.map((objectId: string) =>
        fetch('http://localhost:3001/create/groups/add-object', {
          method: 'POST',
          headers,
          body: JSON.stringify({ groupId, objectId }),
        })
      ) || [];

    try {
      await Promise.all([...characterPromises, ...locationPromises, ...objectPromises]);
      console.log('Relationships created successfully');
    } catch (error) {
      console.error('Error creating relationships:', error);
    }
  };
  // Function to convert File to byte array
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
    return null;
  };

  const renderCheckboxes = () => {
    if (type === 'groups' && characters.length > 0 && locations.length > 0 && objects.length > 0) {
      return (
        <>
          <Label text="Персонажи">
            {characters.map((character) => (
              <Checkbox
                key={character.id}
                label={character.title}
                register={register('characterIds')}
                value={String(character.id)}
              />
            ))}
          </Label>
          <Label text="Локации">
            {locations.map((location) => (
              <Checkbox
                key={location.id}
                label={location.title}
                register={register('locationIds')}
                value={String(location.id)}
              />
            ))}
          </Label>
          <Label text="Объекты">
            {objects.map((object) => (
              <Checkbox
                key={object.id}
                label={object.title}
                register={register('objectIds')}
                value={String(object.id)}
              />
            ))}
          </Label>
        </>
      );
    }
    return null;
  };

  return (
    <FormProvider {...{ register, handleSubmit, setValue, reset, defaultValues, getValues }}>
      <div>
        {isAuthenticated && type && createPageData ? (
          <CreatePageMaket
            typeSidebar={createPageData.typeSidebar}
            title={createPageData.title}
            subtitle={subtitle}
            masItems={createPageData.masTitle}
            showImageInput={createPageData.showImageInput}
            showCancelButton={true}
            register={register}
            setValue={setValue}
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            {renderCustomFields()}
            {renderCheckboxes()}
          </CreatePageMaket>
        ) : (
          <div>
            {loading ? (
              <Loading />
            ) : (
              <Message title={'СООБЩЕНИЕ'} message={'Вы не авторизованы или нет подходящих данных'} />
            )}
          </div>
        )}
      </div>
    </FormProvider>
  );
}
