'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../store/thunks/fetchCards';
import { RootState, AppDispatch } from '../store';
import { useParams } from 'next/navigation';

interface ParamsId {
  projectId: string;
}

interface Params {
  slug: 'ideas' | 'projects';
}

interface Props {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function MainThema({ params }: Props) {
  const paramsId = useParams<ParamsId>();
  const { projectId } = paramsId;
  const { slug } = params;
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { items, isLoading, error, typeSidebar, typeCard, title, subtitle, createPageUrl } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCards(slug));
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router, dispatch, slug]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CardsPageMaket
      projectId={projectId}
      typeSidebar={typeSidebar}
      typeCard={typeCard}
      title={title}
      subtitle={subtitle}
      masItems={items}
      createPageUrl={createPageUrl}
    />
  );
}
