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

interface RouteParams {
  type?: string;
  [key: string]: string | undefined;
}

export default function CreateItemPage() {
  const { type } = useParams<RouteParams>();
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const { createPageData, loading, error } = useSelector((state: RootState) => state.createPage);
  const subtitle = useSelector((state: RootState) => state.posts.subtitle);

  useEffect(() => {
    if (isAuthenticated && type) {
      dispatch(fetchCreatePageData({ type: type }));
    } else if (!isAuthenticated) {
      router.push('/auth/autorisation');
    }
  }, [type, dispatch, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!createPageData) {
    return <div>No create page data available.</div>;
  }

  const handleSubmit = async (formData: any) => {
    if (!type) return;

    console.log('Form Data:', formData);
    console.log('Type:', type);

    const apiUrl = `http://localhost:3001/auth/${type}s`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);

      const redirectUrl = `/${type}s/${data.id}`;
      router.push(redirectUrl);
    } catch (error) {
      console.error('Error creating item:', error);
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
            />
          </Label>
        </>
      );
    }
    return null;
  };

  return (
    <CreatePageMaket
      typeSidebar={createPageData.typeSidebar}
      title={createPageData.title}
      subtitle={subtitle}
      masItems={createPageData.masTitle}
      showImageInput={createPageData.showImageInput}
      showCancelButton={true}
      onSubmit={handleSubmit}
    >
      {renderCustomFields()}
    </CreatePageMaket>
  );
}
