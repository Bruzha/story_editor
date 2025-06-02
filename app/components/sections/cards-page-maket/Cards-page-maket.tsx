'use client';

import React, { useState } from 'react';
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
  const itemsPerPage = 8;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = masItems.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <Maket typeSidebar={typeSidebar} title={title} subtitle={subtitle}>
      <Search showCreateButton={showCreateButton} createPageUrl={createPageUrl} />
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
        totalItems={masItems.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Maket>
  );
}
