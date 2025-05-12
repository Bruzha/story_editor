'use client';
import Maket from '../components/sections/maket/Maket';
import Card from '../components/ui/card/Card';
import Search from '../components/sections/search/Search';
import Pagination from '../components/ui/pagination/Pagination';
import React, { useState } from 'react';
import './style.scss';

export default function Advices() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const projects = [
    {
      id: 0,
      data: ['Совет 1', 'Текст совета'],
      markColor: '#ff0000',
    },
    {
      id: 1,
      data: ['Совет 2', 'Текст совета'],
      markColor: '',
    },
    {
      id: 2,
      data: ['Совет 3', 'Текст совета'],
      markColor: '',
    },
    {
      id: 3,
      data: ['Совет 4', 'Текст совета'],
      markColor: '#ff0000',
    },
    {
      id: 4,
      data: ['Совет 5', 'Текст совета'],
      markColor: '',
    },
    {
      id: 5,
      data: ['Совет 6', 'Текст совета'],
      markColor: '',
    },
    {
      id: 6,
      data: ['Совет 7', 'Текст совета'],
      markColor: '#ff0000',
    },
    {
      id: 7,
      data: ['Совет 8', 'Текст совета'],
      markColor: '',
    },
    {
      id: 8,
      data: ['Совет 9', 'Текст совета'],
      markColor: '',
    },
    {
      id: 9,
      data: ['Совет 10', 'Текст совета'],
      markColor: '#ff0000',
    },
    {
      id: 10,
      data: ['Совет 11', 'Текст совета'],
      markColor: '',
    },
    {
      id: 11,
      data: ['Совет 12', 'Текст совета'],
      markColor: '',
    },
  ];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Maket typeSidebar="help" title="СОВЕТЫ" subtitle="Ruzhastik">
      <Search />
      {currentItems.map((project) => (
        <div className="advices__item" key={project.id}>
          <Card key={project.id} id={project.id} data={project.data} markColor={project.markColor} />
        </div>
      ))}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={projects.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Maket>
  );
}
