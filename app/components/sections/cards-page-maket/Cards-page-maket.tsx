'use client';

import React, { useState, useEffect } from 'react';
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
  masItems: ItemsData[];
  showDeleteButton?: boolean;
  showCreateButton?: boolean;
  showCopyButton?: boolean;
  createPageUrl?: string;
  onSearch?: (query: string) => void;
}

export default function CardsPageMaket({
  typeSidebar,
  title,
  typeCard,
  subtitle,
  masItems,
  showDeleteButton = true,
  showCreateButton = true,
  showCopyButton = true,
  createPageUrl = '/create_project',
}: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<ItemsData[]>([]);
  const itemsPerPage = 8;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setFilteredItems(masItems);
    setCurrentPage(1);
  }, [masItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const filterItems = (query: string) => {
    if (!query) {
      setFilteredItems(masItems);
      setCurrentPage(1);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = masItems.filter((item) => {
      return Object.values(item.data).some((value: any) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseQuery);
        }
        return false;
      });
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    filterItems(query);
  };

  return (
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle}>
      <Search
        showCreateButton={showCreateButton}
        showCopyButton={showCopyButton}
        createPageUrl={createPageUrl}
        onSearch={handleSearch}
      />{' '}
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
        totalItems={filteredItems.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Maket>
  );
}
