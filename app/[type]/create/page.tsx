// app/[type]/create/page.tsx
'use client';

import CreatePageMaket from '@/app/components/sections/create-page-maket/Create-page-maket';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store';
import { useAuth } from '@/app/AuthContext';
import { fetchCreatePageData } from '@/app/store/thunks/fetchCreatePageData';
import Label from '@/app/components/ui/label/Label';
import Select from '@/app/components/ui/select/Select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { parseCookies } from 'nookies';
import Message from '@/app/components/ui/message/Message';
import Loading from '@/app/components/ui/loading/Loading';
import { addCard } from '@/app/store/reducers/cardsReducer';
import { ItemsData } from '@/app/types/types';
import { fetchItemData } from '@/app/store/thunks/fetchItemData';

interface RouteParams {
  type?: string;
  [key: string]: string | undefined;
}

export default function CreateItemPage() {
  const { type } = useParams<RouteParams>();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { createPageData, loading } = useSelector((state: RootState) => state.createPage);
  const subtitle = useSelector((state: RootState) => state.posts.subtitle);
  const projectId = useSelector((state: RootState) => state.project.projectId);

  const { register, handleSubmit, setValue } = useForm(); // Moved useForm outside the conditional block

  useEffect(() => {
    if (isAuthenticated && type) {
      dispatch(fetchCreatePageData({ type: type }));
    } else if (!isAuthenticated) {
      router.push('/auth/autorisation');
    }
  }, [type, dispatch, isAuthenticated, router]);

  const handleFormSubmit: SubmitHandler<any> = async (data: any) => {
    if (!type) return;

    console.log('Form data:', data);
    console.log('createPageData:', createPageData);

    // Соберите данные из всех полей, включая Textarea
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

    // Добавьте маркерный цвет
    const markerColor = data.markerColor || '#4682B4';

    // Добавьте миниатюру (если есть)
    let miniatureData = null;
    console.log('data.miniature:', data.miniature);
    if (data.miniature) {
      miniatureData = await convertFileToByteArray(data.miniature); // Function to convert file to bytea
    }

    const payload = {
      info: formData,
      ...customFields,
      markerColor: markerColor,
      miniature: miniatureData,
      projectId: projectId, // Добавьте projectId
    };

    console.log('Payload:', payload);

    const cookies = parseCookies();
    const jwtToken = cookies['jwt'];
    console.log('Sending token:', jwtToken);
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
      console.log('Success:', newItem);

      // Dispatch action to add the card in cardsReducer
      const newCard: ItemsData = {
        id: newItem.id,
        src: newItem.miniature ? `data:image/png;base64,${Buffer.from(newItem.miniature).toString('base64')}` : null,
        data: Object.values(newItem.info).map((info: any) => info.value), // Extract data for the card
        markColor: newItem.markerColor,
      };
      dispatch(addCard(newCard));

      dispatch(fetchItemData({ type, id: newItem.id })); // Dispatch fetchItemData after creating the item

      const redirectUrl = `/${type}/${newItem.id}`; // Use newItem.id
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error creating item:', error);
      return <Message title={'ОШИБКА'} message={`Ошибка создания элемента: ${error}`} />; // Return Message component
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

  return (
    <div>
      {isAuthenticated && type && createPageData ? ( // Render CreatePageMaket only if authenticated, type is available, and createPageData is loaded
        <CreatePageMaket
          typeSidebar={createPageData.typeSidebar}
          title={createPageData.title}
          subtitle={subtitle}
          masItems={createPageData.masTitle}
          showImageInput={createPageData.showImageInput}
          showCancelButton={true}
          register={register} // Pass the register function
          setValue={setValue}
          onSubmit={handleSubmit(handleFormSubmit)} // Pass the handleSubmit function
        >
          {renderCustomFields()}
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
  );
}
