'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import CardsPageMaket from '../components/sections/cards-page-maket/Cards-page-maket';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../store/thunks/fetchCards';
import { RootState, AppDispatch } from '../store';
import Loading from '../components/ui/loading/Loading';
import Message from '../components/ui/message/Message';

interface Props {
  params: { slug: string[] };
}

export default function CardsPage({ params }: Props) {
  const { slug } = params;
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const projectId = useSelector((state: RootState) => state.project.projectId);

  useEffect(() => {
    console.log({ params });
  }, []);

  const { items, isLoading, error, typeSidebar, typeCard, title, subtitle, createPageUrl } = useSelector(
    (state: RootState) => state.posts
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCards(slug, projectId || undefined));
      console.log('projectId fetchCards: ' + projectId);
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router, dispatch, slug, projectId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Message title={'ОШИБКА'} message={error} />;
  }

  let finalCreatePageUrl = createPageUrl;
  if (projectId && createPageUrl) {
    finalCreatePageUrl = createPageUrl.replace('PROJECT_ID_PLACEHOLDER', projectId);
  }

  let showCopyButton = false;
  let showCreateButton,
    showDeleteButton = true;
  if (typeSidebar === 'project' || typeSidebar === 'timeline') {
    showCopyButton = true;
  }
  if (typeSidebar === 'help') {
    showCreateButton = false;
    showDeleteButton = false;
  }
  return (
    <CardsPageMaket
      typeSidebar={typeSidebar}
      typeCard={typeCard}
      showCopyButton={showCopyButton}
      showCreateButton={showCreateButton}
      showDeleteButton={showDeleteButton}
      title={title}
      subtitle={subtitle}
      masItems={items}
      createPageUrl={finalCreatePageUrl}
    />
  );
}
