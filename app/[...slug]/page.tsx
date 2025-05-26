'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../store/thunks/fetchCards';
import { RootState, AppDispatch } from '../store';

interface Props {
  params: { slug: string[] };
}

export default function CardsPage({ params }: Props) {
  const { slug } = params;
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const projectId = slug && slug.length > 1 ? slug[1] : undefined;

  useEffect(() => {
    console.log({ params });
  }, []);

  const { items, isLoading, error, typeSidebar, typeCard, title, subtitle, createPageUrl } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCards(slug, projectId));
      console.log('projectId fetchCards: ' + projectId);
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router, dispatch, slug, projectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CardsPageMaket
      typeSidebar={typeSidebar}
      typeCard={typeCard}
      title={title}
      subtitle={subtitle}
      masItems={items}
      createPageUrl={createPageUrl}
    />
  );
}
