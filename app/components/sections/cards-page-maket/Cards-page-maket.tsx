'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Maket from '../maket/Maket';
import Card from '../../ui/card/Card';
import Search from '../../sections/search/Search';
import Pagination from '../../ui/pagination/Pagination';

interface IProps {
  typeSidebar: 'profile' | 'project' | 'timeline' | 'help' | 'create_character' | string | '';
  title: string;
  subtitle: string;
  typeCard: string;
  masItems: any[];
  showDeleteButton?: boolean;
  showCreateButton?: boolean;
  showCopyButton?: boolean;
  createPageUrl?: string;
  onSearch?: (query: string) => void;
  displayFields: string[];
  onSort: (sortBy: string) => void;
  sortBy: string;
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
  displayFields,
  onSort,
  sortBy,
}: IProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [sortedItems, setSortedItems] = useState<any[]>([]); // ADD: Sorted items state
  const itemsPerPage = 8;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setFilteredItems(masItems);
    setCurrentPage(1);
  }, [masItems, sortBy]);

  useEffect(() => {
    sortItems(sortBy);
  }, [sortBy, filteredItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const filterItems = (query: string) => {
    if (!query) {
      setFilteredItems(masItems);
      setCurrentPage(1);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = masItems.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseQuery);
        } else if (typeof value === 'object' && value !== null) {
          return Object.values(value).some((nestedValue) => {
            if (typeof nestedValue === 'string') {
              return nestedValue.toLowerCase().includes(lowerCaseQuery);
            } else if (typeof nestedValue === 'object' && nestedValue !== null && nestedValue.hasOwnProperty('value')) {
              return nestedValue.value.toLowerCase().includes(lowerCaseQuery);
            }
            return false;
          });
        }
        return false;
      });
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const sortItems = useCallback(
    (sortBy: string) => {
      console.log('sortItems called with:', sortBy);
      const sorted = [...filteredItems];
      switch (sortBy) {
        case 'date':
          console.log('Sorting by date');
          sorted.sort((a, b) => {
            const dateA = parseDate(a.createdAt);
            const dateB = parseDate(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'name':
          console.log('Sorting by name');
          sorted.sort((a, b) => {
            const nameA = a.name || a.title || a.info?.name?.value || a.info?.title?.value || '';
            const nameB = b.name || b.title || b.info?.name?.value || b.info?.title?.value || '';
            return nameA.localeCompare(nameB);
          });
          break;
        case 'event':
          console.log('Sorting by event');
          sorted.sort((a, b) => {
            const dateA = parseDate(a.eventDate);
            const dateB = parseDate(b.eventDate);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'order':
          console.log('Sorting by order');
          sorted.sort((a, b) => {
            const orderA = a.info?.order?.value || '';
            const orderB = b.info?.order?.value || '';
            return orderA.localeCompare(orderB);
          });
          break;
        default:
          console.log('No sorting');
          break;
      }
      console.log('Sorted items:', sorted);
      setSortedItems(sorted);
    },
    [filteredItems]
  );

  function parseDate(dateString: string): Date {
    const parts = dateString.split(', ')[0].split('.');
    const timeParts = dateString.split(', ')[1].split(':');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes);
  }

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
        onSort={onSort}
      />
      {currentItems.map((item) => {
        const data = displayFields.map((field) => {
          let value;
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            value = item[parent]?.[child];
          } else {
            value = item[field];
          }

          if (typeof value === 'object' && value !== null && value.hasOwnProperty('value')) {
            value = value.value;
          }

          return value || '';
        });

        return (
          <Card
            key={item.id}
            id={item.id}
            type={typeCard}
            src={item.src}
            data={data}
            markColor={item.markerColor}
            showDeleteButton={showDeleteButton}
          />
        );
      })}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Maket>
  );
}
