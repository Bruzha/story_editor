'use client';

import React, { useEffect, useState, memo } from 'react';
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

type TypeSidebar = 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';

interface CardData {
  items?: any[];
  isLoading?: boolean;
  error?: string | null;
  typeSidebar?: TypeSidebar;
  typeCard?: string; // Replace string with the correct type if it's not a string
  title?: string;
  subtitle?: string;
  createPageUrl?: string;
  displayFields?: string[]; // ADD displayFields
}

const defaultCardData: CardData = {
  isLoading: false,
  error: null,
};

function CardsPage({ params }: Props) {
  const { slug } = params;
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState('date');

  const projectId = useSelector((state: RootState) => state.project.projectId);

  const {
    items = [],
    typeSidebar = '',
    typeCard = '',
    title = '',
    subtitle = '',
    createPageUrl = '',
    displayFields = [],
  } = useSelector((state: RootState) => state.cards.cachedData[slug.join('/')] || defaultCardData);

  console.log(
    'useSelector((state: RootState) => state.cards: ',
    useSelector((state: RootState) => state.cards)
  );
  const { isLoading, error } = useSelector((state: RootState) => ({
    isLoading: state.cards.isLoading,
    error: state.cards.error,
  }));

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCards(slug));
    } else {
      router.push('/auth/autorisation');
    }
  }, [isAuthenticated, router, dispatch, slug]);
  console.log('items: ', items);
  const handleSort = (sortByOption: string) => {
    setSortBy(sortByOption);
  };

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
      displayFields={displayFields}
      onSort={handleSort}
      sortBy={sortBy}
    />
  );
}

export default memo(CardsPage);
