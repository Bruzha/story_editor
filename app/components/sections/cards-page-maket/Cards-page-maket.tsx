'use client';

import React, { useState, useEffect } from 'react'; //  Добавляем useEffect
import Maket from '../maket/Maket';
import Card from '../../ui/card/Card';
import Search from '../../sections/search/Search';
import Pagination from '../../ui/pagination/Pagination';
import { ItemsData } from '@/app/types/types';

interface IProps {
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | '';
  title: string;
  subtitle: string;
  typeCard: 'project' | 'character' | 'idea' | string;
  masItems: ItemsData[]; // Use ItemsData[]
  showDeleteButton?: boolean;
  showCreateButton?: boolean;
  createPageUrl?: string;
  onSearch?: (query: string) => void; // Добавили пропс onSearch
}

export default function CardsPageMaket({
  typeSidebar,
  title,
  typeCard,
  subtitle,
  masItems,
  showDeleteButton = true,
  showCreateButton = true,
  createPageUrl = '/create_project',
}: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>([]); // Инициализируем пустым массивом
  const itemsPerPage = 8;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Эффект, чтобы обновить filteredItems, когда masItems изменяется (например, после загрузки данных)
  useEffect(() => {
    setFilteredItems(masItems); //  Изначально отображаем все элементы
    setCurrentPage(1); // Сбрасываем страницу при изменении masItems
  }, [masItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem); //  Используем filteredItems

  // Функция для фильтрации элементов
  const filterItems = (query: string) => {
    if (!query) {
      setFilteredItems(masItems); //  Если запрос пустой, отображаем все элементы
      setCurrentPage(1); // Сбрасываем страницу
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = masItems.filter((item) => {
      //  Поиск по всем полям (или по нужным полям)
      return Object.values(item.data).some((value: any) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseQuery);
        }
        return false; //  Обработка не строковых значений (или исключение полей)
      });
    });
    setFilteredItems(filtered); //  Обновляем состояние
    setCurrentPage(1); // Сбрасываем страницу
  };

  // Обработчик поискового запроса
  const handleSearch = (query: string) => {
    filterItems(query); //  Вызываем функцию фильтрации
  };

  return (
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle}>
      <Search showCreateButton={showCreateButton} createPageUrl={createPageUrl} onSearch={handleSearch} />{' '}
      {/* Передаем onSearch */}
      {currentItems.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          type={typeCard}
          src={item.src}
          data={item.data}
          markColor={item.markColor}
          showDeleteButton={showDeleteButton}
        />
      ))}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length} // Используем filteredItems.length
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Maket>
  );
}
