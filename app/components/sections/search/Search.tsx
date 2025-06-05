'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './style.scss';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import { clearCharacterData } from '@/app/store/reducers/characterReducer';
import { AppDispatch } from '@/app/store';
import { useDispatch } from 'react-redux';

interface IProps {
  showCreateButton?: boolean;
  showCopyButton?: boolean;
  createPageUrl?: string;
  onSearch: (query: string) => void;
}

export default function Search({
  showCreateButton = true,
  showCopyButton = true,
  createPageUrl = '/create_project',
  onSearch,
}: IProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const handleCreateClick = () => {
    dispatch(clearCharacterData());
    router.push(createPageUrl);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="search">
      <div className="search__input">
        <Input placeholder="Поиск" iconSrc="/icons/search.svg" onChange={handleSearchChange} value={searchQuery} />
      </div>
      <div className="search__button">
        <Button name={'Найти'} type="button" onClick={handleSearchClick} />
        {showCreateButton && <Button name={'Создать'} type="button" onClick={handleCreateClick} />}
        {showCopyButton && <Button name={'Добавить из проекта'} type="button" onClick={handleCreateClick} />}
      </div>
    </div>
  );
}
