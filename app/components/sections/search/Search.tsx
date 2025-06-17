'use client';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import './style.scss';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import { clearCharacterData, setCharacterData } from '@/app/store/reducers/characterReducer';
import { AppDispatch } from '@/app/store';
import { useDispatch } from 'react-redux';
import createPageData from '@/backend/src/data/createPageData';
import Select from '../../ui/select/Select';

interface IProps {
  showCreateButton?: boolean;
  showCopyButton?: boolean;
  createPageUrl?: string;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
}

export default function Search({
  showCreateButton = true,
  showCopyButton = true,
  createPageUrl = '/create_project',
  onSearch,
  onSort,
}: IProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const dispatch: AppDispatch = useDispatch();

  const handleCreateClick = () => {
    dispatch(clearCharacterData());
    if (createPageUrl === '/characters/create?typePage=characters') {
      const initialData = createPageData
        .filter((item) => item.type === 'characters')
        .reduce(
          (acc, item) => {
            const typePage = item.typePage || 'social';
            acc[typePage] = item.masTitle.reduce((pageAcc: { [key: string]: { value: string } }, field) => {
              pageAcc[field.key] = { value: '' };
              return pageAcc;
            }, {});
            return acc;
          },
          {
            characters: {},
            appearance: {},
            personality: {},
            social: {},
          }
        );

      dispatch(setCharacterData({ typePage: 'characters', data: initialData.characters }));
      dispatch(setCharacterData({ typePage: 'appearance', data: initialData.appearance }));
      dispatch(setCharacterData({ typePage: 'personality', data: initialData.personality }));
      dispatch(setCharacterData({ typePage: 'social', data: initialData.social }));
    }
    router.push(createPageUrl);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  const handleSortChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedSortBy = event.target.value;
      console.log('selectedSortBy', selectedSortBy);
      setSortBy(selectedSortBy);
      onSort(selectedSortBy);
    },
    [onSort]
  );

  let options;
  if (createPageUrl === '/chapters/create') {
    options = [
      { value: 'order', label: 'По номеру' },
      { value: 'name', label: 'По названию' },
      { value: 'date', label: 'По дате создания' },
    ];
  } else if (createPageUrl === '/time_events/create') {
    options = [
      { value: 'event', label: 'По дате события' },
      { value: 'name', label: 'По названию' },
      { value: 'date', label: 'По дате создания' },
    ];
  } else {
    options = [
      { value: 'date', label: 'По дате создания' },
      { value: 'name', label: 'По названию' },
    ];
  }
  return (
    <div className="search">
      <div className="search__select">
        <Select title="Сортировка карточек" options={options} onChange={handleSortChange} value={sortBy} />
      </div>
      <div className="search__input">
        <Input
          title="Поле для ввода значения поиска"
          placeholder="Поиск"
          iconSrc="/icons/search.svg"
          onChange={handleSearchChange}
          value={searchQuery}
        />
      </div>
      <div className="search__button">
        <Button name={'Найти'} type="button" onClick={handleSearchClick} />
        {showCreateButton && <Button name={'Создать'} type="button" onClick={handleCreateClick} />}
        {showCopyButton && <Button name={'Добавить из проекта'} type="button" onClick={handleCreateClick} />}
      </div>
    </div>
  );
}
