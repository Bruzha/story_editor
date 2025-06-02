'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './style.scss';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';

interface IProps {
  showCreateButton?: boolean;
  createPageUrl?: string;
  onSearch: (query: string) => void; // Добавим пропс для отправки запроса в родительский компонент
}

export default function Search({ showCreateButton = true, createPageUrl = '/create_project', onSearch }: IProps) {
  // Добавим пропс onSearch
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateClick = () => {
    router.push(createPageUrl);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    //  В этом месте, вероятно, нужно будет запускать поиск.
  };

  const handleSearchClick = () => {
    //  Обработчик нажатия на кнопку "Найти"
    onSearch(searchQuery); //  Вызываем функцию onSearch, передавая searchQuery
  };

  return (
    <div className="search">
      <div className="search__input">
        <Input placeholder="Поиск" iconSrc="/icons/search.svg" onChange={handleSearchChange} value={searchQuery} />
      </div>
      <div className="search__button">
        <Button name={'Найти'} type="button" onClick={handleSearchClick} />
        {showCreateButton && <Button name={'Создать'} type="button" onClick={handleCreateClick} />}
      </div>
    </div>
  );
}
